'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, Unplug, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { IntegrationService } from '@/app/lib/integrations/IntegrationService';
import { getServiceDescriptor } from '@/app/lib/integrations/oauth/OAuthConfig';
// Remove server-side import and use direct API calls
import { Switch } from '@/components/ui/switch';

interface ServiceWithStatus {
  id: string;
  service_name: string;
  tags: string[];
  description?: string;
  isActive: boolean;
  isConnected: boolean;
  integration_id?: string;
  status?: string;
  isPendingSetup?: boolean;
  isSystemIntegration?: boolean;
  public: boolean;
  type: string;
}

interface IntegrationsClientProps {
  userId: string;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'connected':
    case 'active':
      return 'bg-green-500';
    case 'pending_setup':
    case 'pending':
      return 'bg-yellow-500';
    case 'disconnected':
    case 'inactive':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'connected':
    case 'active':
      return 'Connected';
    case 'pending_setup':
    case 'pending':
      return 'Pending Setup';
    case 'disconnected':
    case 'inactive':
      return 'Disconnected';
    default:
      return 'Unknown';
  }
}

// Define service categories (from React Native)
function getServiceCategory(serviceName: string): string {
  const name = serviceName.toLowerCase();
  
  // Health and Wellness
  if (['oura', 'fitbit'].includes(name)) {
    return 'Health and Wellness';
  }
  
  // Email
  if (['gmail', 'microsoft outlook email', 'microsoft outlook mail'].includes(name)) {
    return 'Email';
  }
  
  // Communications
  if (['slack', 'microsoft teams', 'twilio', 'textbelt'].includes(name)) {
    return 'Communications';
  }
  
  // Productivity and Task Management
  if (['notion', 'todoist', 'any.do'].includes(name)) {
    return 'Productivity and Task Management';
  }
  
  // Calendar
  if (['google calendar', 'microsoft outlook calendar', 'microsoft calendar'].includes(name)) {
    return 'Calendar';
  }
  
  // Video Conferencing
  if (['google meet'].includes(name)) {
    return 'Video Conferencing';
  }
  
  // Research
  if (['research', 'ai', 'search', 'perplexity'].includes(name)) {
    return 'Research';
  }
  
  // Cloud Storage
  if (['dropbox'].includes(name)) {
    return 'Cloud Storage';
  }
  
  // Cloud Text Documents
  if (['google docs', 'microsoft word online'].includes(name)) {
    return 'Cloud Text Documents';
  }
  
  // Cloud Spreadsheets
  if (['google sheets', 'microsoft excel online'].includes(name)) {
    return 'Cloud Spreadsheets';
  }
  
  // Default category for uncategorized services
  return 'Other';
}

// Organize regular services into categories (excludes system integrations and non-public services)
function organizeServicesByCategory(services: ServiceWithStatus[]) {
  const categoryMap: { [key: string]: ServiceWithStatus[] } = {};
  
  // Filter out system integrations and non-public services from regular categories
  const regularServices = services.filter(service => !service.isSystemIntegration && service.public);
  
  regularServices.forEach(service => {
    const category = getServiceCategory(service.service_name);
    if (!categoryMap[category]) {
      categoryMap[category] = [];
    }
    categoryMap[category].push(service);
  });
  
  // Define the order of categories
  const categoryOrder = [
    'Health and Wellness',
    'Email',
    'Communications',
    'Productivity and Task Management',
    'Calendar',
    'Video Conferencing',
    'Cloud Storage',
    'Cloud Text Documents',
    'Cloud Spreadsheets',
    'Other'
  ];
  
  // Create sorted categories array
  const categories: { name: string; services: ServiceWithStatus[] }[] = [];
  categoryOrder.forEach(categoryName => {
    if (categoryMap[categoryName] && categoryMap[categoryName].length > 0) {
      // Sort services within each category alphabetically
      const sortedServices = categoryMap[categoryName].sort((a, b) => 
        a.service_name.localeCompare(b.service_name)
      );
      categories.push({
        name: categoryName,
        services: sortedServices
      });
    }
  });
  
  return categories;
}

// Get system integrations (only public ones)
function getSystemIntegrations(services: ServiceWithStatus[]): ServiceWithStatus[] {
  return services.filter(service => service.isSystemIntegration && service.public);
}

export function IntegrationsClient({ userId }: IntegrationsClientProps) {
  const [services, setServices] = useState<ServiceWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const integrationService = new IntegrationService();

  // Load services and user integrations (following React Native pattern)
  const loadServicesWithStatus = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get database integrations via API
      const response = await fetch('/api/integrations');
      if (!response.ok) {
        throw new Error('Failed to fetch integrations');
      }
      const { integrations: dbIntegrations } = await response.json();
      
      // Get ALL OAuth services from config (regardless of client ID configuration)
      const { OAUTH_CONFIG } = await import('@/app/lib/integrations/oauth/OAuthConfig');
      const availableServices = Object.keys(OAUTH_CONFIG);
      console.log('Available OAuth services:', availableServices.length, availableServices);
      
      // Create services list combining OAuth config and database data
      const serviceResults: ServiceWithStatus[] = [];
      
      // Add OAuth services from config
      availableServices.forEach(serviceName => {
        const descriptor = getServiceDescriptor(serviceName);
        const dbIntegration = dbIntegrations.find(
          (int: any) => int.services?.service_name?.toLowerCase() === descriptor?.displayName?.toLowerCase()
        );
        
        const statusMap: Record<string, string> = {
          'active': 'connected',
          'pending': 'pending_setup',
          'inactive': 'disconnected',
          'failed': 'disconnected'
        };
        
        const isActive = dbIntegration ? statusMap[dbIntegration.status] === 'connected' : false;
        
        serviceResults.push({
          id: dbIntegration?.id || `oauth-${serviceName}`,
          service_name: descriptor?.displayName || serviceName,
          tags: [],
          description: descriptor?.description || 'OAuth service integration',
          isActive,
          isConnected: isActive,
          integration_id: dbIntegration?.id,
          status: dbIntegration ? statusMap[dbIntegration.status] || 'disconnected' : 'disconnected',
          isPendingSetup: false,
          isSystemIntegration: false,
          public: true,
          type: 'user'
        });
      });
      
      // Add system integrations from database
      dbIntegrations.forEach((dbIntegration: any) => {
        if (dbIntegration.services?.type === 'system') {
          const statusMap: Record<string, string> = {
            'active': 'connected',
            'pending': 'pending_setup',
            'inactive': 'disconnected',
            'failed': 'disconnected'
          };
          
          const isActive = statusMap[dbIntegration.status] === 'connected';
          
          serviceResults.push({
            id: dbIntegration.id,
            service_name: dbIntegration.services.service_name,
            tags: [],
            description: dbIntegration.services.description || 'System integration',
            isActive,
            isConnected: isActive,
            integration_id: dbIntegration.id,
            status: statusMap[dbIntegration.status] || 'disconnected',
            isPendingSetup: false,
            isSystemIntegration: true,
            public: dbIntegration.services.public !== false,
            type: 'system'
          });
        }
      });
      
      console.log('Final service results:', serviceResults.length, serviceResults);
      setServices(serviceResults);
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServicesWithStatus();
  }, [userId]);

  const categorizedServices = organizeServicesByCategory(services);
  const systemIntegrations = getSystemIntegrations(services);

  const handleConnect = async (service: ServiceWithStatus) => {
    setLoadingStates(prev => ({ ...prev, [service.service_name]: true }));

    try {
      console.log(`Initiating OAuth for ${service.service_name}`);
      
      // Get ALL OAuth services from config
      const { OAUTH_CONFIG } = await import('@/app/lib/integrations/oauth/OAuthConfig');
      const availableServices = Object.keys(OAUTH_CONFIG);
      
      // Convert display name back to service name for OAuth config lookup
      const serviceName = availableServices.find(configService => {
        const descriptor = getServiceDescriptor(configService);
        return descriptor?.displayName === service.service_name;
      }) || service.service_name.toLowerCase().replace(/\s+/g, '_');
      
      const result = await integrationService.initiateOAuth(serviceName);
      
      if (!result.success) {
        throw new Error(result.error || 'OAuth initiation failed');
      }

      // The OAuth flow will handle completion via callback
      toast.success('OAuth flow initiated. Please complete the authorization in the popup window.');

    } catch (error) {
      console.error('OAuth initiation failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start OAuth flow');
    } finally {
      setLoadingStates(prev => ({ ...prev, [service.service_name]: false }));
    }
  };

  const handleDisconnect = async (service: ServiceWithStatus) => {
    if (!service.integration_id) {
      toast.error('No integration ID found');
      return;
    }

    setLoadingStates(prev => ({ ...prev, [service.service_name]: true }));

    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'disconnect',
          integrationId: service.integration_id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect integration');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('Disconnection failed');
      }

      // Reload services to update state
      await loadServicesWithStatus();

      toast.success('Integration disconnected successfully');

    } catch (error) {
      console.error('Disconnection failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to disconnect integration');
    } finally {
      setLoadingStates(prev => ({ ...prev, [service.service_name]: false }));
    }
  };

  const handleSystemIntegrationToggle = async (service: ServiceWithStatus, enabled: boolean) => {
    setLoadingStates(prev => ({ ...prev, [service.service_name]: true }));

    try {
      console.log(`Toggling system integration: ${service.service_name} to ${enabled}`);
      
      // Map specific system services to their integration keys
      const serviceKeyMap: Record<string, string> = {
        'Perplexity': 'perplexity',
        'Textbelt': 'textbelt',
        'XAI Live Search': 'xai_live_search'
      };
      
      const integrationKey = serviceKeyMap[service.service_name];
      if (!integrationKey) {
        toast.error(`No integration key mapped for system service: ${service.service_name}`);
        return;
      }
      
      const response = await fetch('/api/integrations/system', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          integrationKey,
          enabled
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update system integration');
      }

      // Reload services to update state
      await loadServicesWithStatus();
      
    } catch (error) {
      console.error('Error toggling system integration:', error);
      toast.error('Failed to update integration. Please try again.');
    } finally {
      setLoadingStates(prev => ({ ...prev, [service.service_name]: false }));
    }
  };

  const renderActionButton = (service: ServiceWithStatus) => {
    const isLoading = loadingStates[service.service_name];
    
    if (service.isSystemIntegration) {
      return (
        <Switch
          checked={service.isActive}
          onCheckedChange={(enabled) => handleSystemIntegrationToggle(service, enabled)}
          disabled={isLoading}
        />
      );
    }

    if (service.isConnected) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDisconnect(service)}
          disabled={isLoading}
          className="w-full flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Disconnecting...
            </>
          ) : (
            <>
              <Unplug className="h-4 w-4" />
              Disconnect
            </>
          )}
        </Button>
      );
    }

    return (
      <Button
        onClick={() => handleConnect(service)}
        disabled={isLoading}
        className="w-full flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <ExternalLink className="h-4 w-4" />
            Connect
          </>
        )}
      </Button>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading integrations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={loadServicesWithStatus}>Retry</Button>
      </div>
    );
  }

  const regularServices = services.filter(service => !service.isSystemIntegration && service.public);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Integrations</h1>
        <p className="text-muted-foreground">
          Connect your accounts to enable Juniper to help you with tasks across your services.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Connected</h3>
          <div className="text-number-lg mb-1">
            {regularServices.filter(s => s.isConnected).length}
          </div>
          <p className="text-sm text-muted-foreground">Active integrations</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Pending Setup</h3>
          <div className="text-number-lg mb-1">
            {regularServices.filter(s => s.status === 'pending_setup').length}
          </div>
          <p className="text-sm text-muted-foreground">Awaiting completion</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-2">Available</h3>
          <div className="text-number-lg mb-1">
            {regularServices.filter(s => !s.isConnected).length}
          </div>
          <p className="text-sm text-muted-foreground">Ready to connect</p>
        </div>
      </div>

      {/* Integration Categories */}
      <div className="space-y-8">
        {categorizedServices.map(({ name: category, services: categoryServices }) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-card p-6 rounded-lg border border-border"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status || 'disconnected')}`}></div>
                      <h3 className="text-lg font-semibold text-foreground">{service.service_name}</h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium text-foreground">{getStatusText(service.status || 'disconnected')}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4">
                    {renderActionButton(service)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* System Integrations */}
      {systemIntegrations.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold text-foreground">System Integrations</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Built-in services that don't require separate authentication
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemIntegrations.map((service) => (
              <div 
                key={service.id} 
                className="bg-card p-6 rounded-lg border border-border border-l-4 border-l-blue-500"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status || 'disconnected')}`}></div>
                    <div>
                      <h3 className="font-medium text-foreground">{service.service_name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    </div>
                  </div>
                  {renderActionButton(service)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {services.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services available</p>
          <p className="text-sm text-muted-foreground mt-2">
            Services will appear here when they're added to the database
          </p>
        </div>
      )}
    </div>
  );
}