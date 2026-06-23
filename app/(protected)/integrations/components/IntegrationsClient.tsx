'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, Unplug, Settings, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { IntegrationService } from '@/app/lib/integrations/IntegrationService';
// Remove server-side import and use direct API calls
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    case 'active':
      return 'bg-green-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'inactive':
    case 'failed':
    case 'disconnected':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'active':
      return 'Connected';
    case 'pending':
      return 'Pending Setup';
    case 'inactive':
    case 'failed':
    case 'disconnected':
      return 'Disconnected';
    default:
      return 'Disconnected';
  }
}

// Define service categories (from React Native)
function getServiceCategory(serviceName: string): string {
  const name = serviceName.toLowerCase();
  
  // Health and Wellness
  if (['oura', 'fitbit', 'mychart', 'apple health', 'google fit', 'google health connect'].includes(name)) {
    return 'Health and Wellness';
  }
  
  // Email
  if (['gmail', 'microsoft outlook email', 'microsoft outlook mail'].includes(name)) {
    return 'Email';
  }
  
  // Communications
  if (['slack', 'microsoft teams', 'twilio', 'textbelt', 'quo', 'android sms'].includes(name)) {
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
      // Sort services within each category
      let sortedServices;
      if (categoryName === 'Health and Wellness') {
        // Reverse alphabetical for Health and Wellness (Oura before Fitbit)
        sortedServices = categoryMap[categoryName].sort((a, b) => 
          b.service_name.localeCompare(a.service_name)
        );
      } else {
        // Regular alphabetical for other categories
        sortedServices = categoryMap[categoryName].sort((a, b) => 
          a.service_name.localeCompare(b.service_name)
        );
      }
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
  const [showTextbeltForm, setShowTextbeltForm] = useState(false);
  const [textbeltPhoneNumber, setTextbeltPhoneNumber] = useState('');
  const [showQuoForm, setShowQuoForm] = useState(false);
  const [quoApiKey, setQuoApiKey] = useState('');
  const [quoFromNumber, setQuoFromNumber] = useState('');
  const [quoConnectState, setQuoConnectState] = useState<{
    inbound_state: 'active' | 'pending';
    inbound_error?: string;
    message: string;
  } | null>(null);
  const [showAndroidSmsForm, setShowAndroidSmsForm] = useState(false);
  const [androidSmsUsername, setAndroidSmsUsername] = useState('');
  const [androidSmsPassword, setAndroidSmsPassword] = useState('');
  const [androidSmsBaseUrl, setAndroidSmsBaseUrl] = useState('');
  const [androidSmsConnectState, setAndroidSmsConnectState] = useState<{
    inbound_state: 'active' | 'pending';
    inbound_error?: string;
    message: string;
  } | null>(null);
  const integrationService = new IntegrationService();

  // Load services and user integrations (following React Native pattern)
  const loadServicesWithStatus = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get database integrations, system integrations, and all services in parallel
      const [integrationsResponse, systemIntegrationsResponse, servicesResponse] = await Promise.all([
        fetch('/api/integrations'),
        fetch(`/api/integrations/system?userId=${userId}`),
        fetch('/api/services') // We need to create this endpoint to get all services from database
      ]);

      if (!integrationsResponse.ok) {
        throw new Error('Failed to fetch integrations');
      }
      
      const { integrations: dbIntegrations } = await integrationsResponse.json();
      
      // Get system integrations from user profile
      let systemIntegrations: Record<string, boolean> = {
        perplexity: true,
        xai_live_search: true,
        claude_code: true
      };
      
      if (systemIntegrationsResponse.ok) {
        const systemResponse = await systemIntegrationsResponse.json();
        if (systemResponse.success) {
          systemIntegrations = systemResponse.enabled_system_integrations;
        }
      }

      // Get all services from database if available, otherwise fallback to OAuth config
      let allServices: any[] = [];
      
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        allServices = servicesData.services || [];
      }

      console.log('Services loaded from database:', allServices.length);
      console.log('System services found:', allServices.filter(s => s.type === 'system').map(s => s.service_name));
      console.log('Database integrations:', dbIntegrations.length);
      console.log('Active integrations:', dbIntegrations.filter((int: any) => int.is_active).length);
      
      // Create services list ONLY from database services (matching React Native exactly)
      const serviceResults: ServiceWithStatus[] = [];
      
      // Process ONLY services from database (like React Native line 263: allServices.map)
      allServices.forEach(service => {
        // Check if this is a system integration based on database type field
        if (service.type === 'system') {
          // Map service names to integration keys
          const serviceKeyMap: Record<string, string> = {
            'Perplexity': 'perplexity',
            'XAI Live Search': 'xai_live_search',
            'Claude Code': 'claude_code'
          };

          const integrationKey = serviceKeyMap[service.service_name];
          if (!integrationKey) {
            console.warn(`No integration key mapped for system service: ${service.service_name}`);
            return;
          }
          
          const isActive = systemIntegrations[integrationKey] ?? true;
          
          serviceResults.push({
            id: service.id,
            service_name: service.service_name,
            tags: service.tagNames || [],
            description: service.description,
            isActive,
            isConnected: isActive,
            integration_id: undefined, // System integrations don't have integration_id
            status: isActive ? 'active' : 'inactive',
            isPendingSetup: false,
            isSystemIntegration: true,
            public: service.public,
            type: service.type
          });
        } else {
          // Handle regular user integrations (match exactly like React Native)
          const integration = dbIntegrations.find(
            (int: any) => int.service_id === service.id
          );
          
          // Use is_active field exactly like React Native (line 304 in RN)
          const isActive = integration?.is_active;
          let isPendingSetup = false;
          
          // Check for pending setup status (like React Native does for Twilio)
          if (integration && !isActive && 
              ['twilio'].includes(service.service_name.toLowerCase())) {
            // For Twilio, check if setup is pending
            isPendingSetup = true; // Simplified - React Native has more complex logic here
          }
          
          console.log(`Service ${service.service_name}: integration=`, integration?.id, 'is_active=', integration?.is_active, 'computed isActive=', !!isActive);
          
          serviceResults.push({
            id: service.id,
            service_name: service.service_name,
            tags: service.tagNames || [],
            description: service.description,
            isActive: !!isActive,  // Exactly like React Native line 324
            isConnected: !!isActive,  // Exactly like React Native line 325
            integration_id: integration?.id,
            status: integration?.status,
            isPendingSetup,
            isSystemIntegration: false,
            public: service.public,
            type: service.type
          });
        }
      });

      // // Filter out Google Health Connect from the displayed services
      // const filteredResults = serviceResults.filter(
      //   service => service.service_name !== 'Google Health Connect'
      // );

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

  // Handle reconnection success message
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reconnectedService = urlParams.get('reconnected');
    
    if (reconnectedService) {
      // Clear the URL parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('reconnected');
      window.history.replaceState({}, '', newUrl.toString());
      
      // Show success message
      toast.success(`${reconnectedService} reconnected successfully!`);
    }
  }, []);

  const categorizedServices = organizeServicesByCategory(services);
  const systemIntegrations = getSystemIntegrations(services);

  const handleConnect = async (service: ServiceWithStatus) => {
    // Special handling for Textbelt - show credential form instead of OAuth
    if (service.service_name === 'Textbelt') {
      setShowTextbeltForm(true);
      return;
    }

    // Special handling for Quo - show credential form instead of OAuth
    if (service.service_name === 'Quo') {
      setShowQuoForm(true);
      return;
    }

    // Special handling for Android SMS - show credential form instead of OAuth
    if (service.service_name === 'Android SMS') {
      setShowAndroidSmsForm(true);
      return;
    }

    setLoadingStates(prev => ({ ...prev, [service.service_name]: true }));

    try {
      console.log(`Initiating OAuth for ${service.service_name}`);
      
      // Get OAuth services from config and import the descriptor function
      const { OAUTH_CONFIG, getServiceDescriptor } = await import('@/app/lib/integrations/oauth/OAuthConfig');
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

  const handleTextbeltSubmit = async () => {
    if (!textbeltPhoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoadingStates(prev => ({ ...prev, 'Textbelt': true }));

    try {
      console.log('Submitting Textbelt credentials...');
      
      const response = await fetch('/api/integrations/textbelt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: textbeltPhoneNumber.trim(),
          userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save Textbelt credentials');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save Textbelt credentials');
      }

      // Reset form and reload services
      setTextbeltPhoneNumber('');
      setShowTextbeltForm(false);
      await loadServicesWithStatus();

      toast.success('Textbelt connected successfully!');

    } catch (error) {
      console.error('Textbelt setup failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to setup Textbelt');
    } finally {
      setLoadingStates(prev => ({ ...prev, 'Textbelt': false }));
    }
  };

  const handleQuoSubmit = async () => {
    if (!quoApiKey.trim()) {
      toast.error('Please enter your Quo API key');
      return;
    }

    setLoadingStates(prev => ({ ...prev, 'Quo': true }));
    setQuoConnectState(null);

    try {
      console.log('Submitting Quo credentials...');

      // Quo connect MUST go through the FastAPI backend (proxied via this
      // Next.js route) so the server can register the inbound webhook with Quo
      // and store the returned signing key. The proxy attaches the user's
      // Supabase session JWT as a Bearer token.
      const response = await fetch('/api/integrations/quo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: quoApiKey.trim(),
          from_number: quoFromNumber.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to connect Quo');
      }

      // Reload services so the connection status reflects the backend state.
      await loadServicesWithStatus();

      const inboundState: 'active' | 'pending' = result.inbound_state === 'active' ? 'active' : 'pending';

      if (inboundState === 'active') {
        // Fully connected: outbound + inbound both active.
        setShowQuoForm(false);
        setQuoApiKey('');
        setQuoFromNumber('');
        setQuoConnectState(null);
        toast.success('Quo connected successfully! You can now send and receive texts.');
      } else {
        // Connect-anyway / retry-later: outbound is active but inbound (receiving
        // texts) is still pending until 10DLC registration completes and the
        // webhook registers. Show the EXACT backend state to the user.
        setQuoApiKey('');
        setQuoFromNumber('');
        setQuoConnectState({
          inbound_state: 'pending',
          inbound_error: result.inbound_error,
          message:
            result.message ||
            'Quo is connected for sending texts. Receiving texts is still pending until you finish 10DLC registration in Quo and the webhook registers. Juniper will keep retrying automatically.',
        });
        toast.warning('Quo connected for sending. Receiving texts is still pending.');
      }
    } catch (error) {
      console.error('Quo setup failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to setup Quo');
    } finally {
      setLoadingStates(prev => ({ ...prev, 'Quo': false }));
    }
  };

  const handleAndroidSmsSubmit = async () => {
    if (!androidSmsUsername.trim()) {
      toast.error('Please enter your SMS Gateway username');
      return;
    }
    if (!androidSmsPassword.trim()) {
      toast.error('Please enter your SMS Gateway password');
      return;
    }

    setLoadingStates(prev => ({ ...prev, 'Android SMS': true }));
    setAndroidSmsConnectState(null);

    try {
      console.log('Submitting Android SMS credentials...');

      // Android SMS connect MUST go through the FastAPI backend (proxied via
      // this Next.js route) so the server can validate the gateway credentials
      // and register the inbound webhook. The proxy attaches the user's
      // Supabase session JWT as a Bearer token.
      const response = await fetch('/api/integrations/android-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: androidSmsUsername.trim(),
          password: androidSmsPassword.trim(),
          base_url: androidSmsBaseUrl.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to connect Android SMS');
      }

      // Reload services so the connection status reflects the backend state.
      await loadServicesWithStatus();

      const inboundState: 'active' | 'pending' = result.inbound_state === 'active' ? 'active' : 'pending';

      if (inboundState === 'active') {
        // Fully connected: outbound + inbound both active.
        setShowAndroidSmsForm(false);
        setAndroidSmsUsername('');
        setAndroidSmsPassword('');
        setAndroidSmsBaseUrl('');
        setAndroidSmsConnectState(null);
        toast.success('Android SMS connected successfully! You can now send and receive texts.');
      } else {
        // Connect-anyway / retry-later: outbound is active but inbound (receiving
        // texts) is still pending until the gateway webhook registers. Show the
        // EXACT backend state to the user.
        setAndroidSmsUsername('');
        setAndroidSmsPassword('');
        setAndroidSmsBaseUrl('');
        setAndroidSmsConnectState({
          inbound_state: 'pending',
          inbound_error: result.inbound_error,
          message:
            result.message ||
            'Android SMS is connected for sending texts. Receiving texts is still pending until the SMS Gateway webhook registers. Juniper will keep retrying automatically.',
        });
        toast.warning('Android SMS connected for sending. Receiving texts is still pending.');
      }
    } catch (error) {
      console.error('Android SMS setup failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to setup Android SMS');
    } finally {
      setLoadingStates(prev => ({ ...prev, 'Android SMS': false }));
    }
  };

  const handleReconnect = async (service: ServiceWithStatus) => {
    if (!service.integration_id) {
      toast.error('No integration ID found');
      return;
    }


    setLoadingStates(prev => ({ ...prev, [service.service_name]: true }));

    try {
      console.log(`🔄 Reconnecting ${service.service_name}...`);
      
      const result = await integrationService.reconnectIntegration(
        service.integration_id,
        service.service_name
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Reconnection failed');
      }

      // Reload services to update state
      await loadServicesWithStatus();

      toast.success('Reconnection initiated. Please complete the authorization in the popup window.');

    } catch (error) {
      console.error('Reconnection failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reconnect integration');
    } finally {
      setLoadingStates(prev => ({ ...prev, [service.service_name]: false }));
    }
  };

  const handleDisconnect = async (service: ServiceWithStatus) => {
    if (!service.integration_id) {
      toast.error('No integration ID found');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to disconnect ${service.service_name}? This will revoke access and you'll need to reconnect to use this service again.`
    );
    
    if (!confirmed) return;

    setLoadingStates(prev => ({ ...prev, [service.service_name]: true }));

    try {
      // Quo + Android SMS MUST disconnect through the FastAPI backend (proxied
      // via dedicated routes) so the server can delete the inbound webhook
      // registered on the provider; the generic disconnect only removes the
      // local integration record and would orphan the remote webhook.
      const dedicatedDisconnectRoute =
        service.service_name === 'Quo'
          ? '/api/integrations/quo'
          : service.service_name === 'Android SMS'
            ? '/api/integrations/android-sms'
            : null;

      const response = dedicatedDisconnectRoute
        ? await fetch(dedicatedDisconnectRoute, { method: 'DELETE' })
        : await fetch('/api/integrations', {
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
      
      // Map specific system services to their integration keys (matching React Native pattern)
      const serviceKeyMap: Record<string, string> = {
        'Perplexity': 'perplexity',
        'XAI Live Search': 'xai_live_search',
        'Claude Code': 'claude_code'
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

      const result = await response.json();
      
      if (!result.success) {
        throw new Error('System integration update failed');
      }

      // Reload services to update state
      await loadServicesWithStatus();
      
      toast.success(`${service.service_name} ${enabled ? 'enabled' : 'disabled'} successfully`);
      
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

    // Special handling for mobile app only integrations
    if (['Apple Health', 'Google Health Connect', 'MyChart', 'Oura', 'Fitbit'].includes(service.service_name)) {
      return (
        <Button
          variant="outline"
          size="sm"
          disabled={true}
          className="w-full flex items-center gap-2 cursor-not-allowed opacity-60"
        >
          <Smartphone className="h-4 w-4" />
          Connect in mobile app only
        </Button>
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
          Connect your accounts to enable Juniper to perform tasks across your services.
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

                  {/* Textbelt Credential Form */}
                  {service.service_name === 'Textbelt' && showTextbeltForm && !service.isConnected && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Smartphone className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-blue-900">SMS Setup</h4>
                      </div>
                      <p className="text-sm text-blue-700 mb-4">
                        Enter your phone number to receive text messages from Juniper. You will not receive promotional content.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="phone" className="text-sm font-medium text-blue-900">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="1234567890"
                            value={textbeltPhoneNumber}
                            onChange={(e) => setTextbeltPhoneNumber(e.target.value)}
                            className="mt-1"
                            disabled={loadingStates['Textbelt']}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowTextbeltForm(false);
                              setTextbeltPhoneNumber('');
                            }}
                            disabled={loadingStates['Textbelt']}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleTextbeltSubmit}
                            disabled={loadingStates['Textbelt'] || !textbeltPhoneNumber.trim()}
                            className="flex-1"
                          >
                            {loadingStates['Textbelt'] ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Connecting...
                              </>
                            ) : (
                              'Connect'
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quo Credential Form */}
                  {service.service_name === 'Quo' && showQuoForm && !service.isConnected && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Smartphone className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-blue-900">Quo SMS Setup</h4>
                      </div>
                      <div className="text-sm text-blue-700 mb-4">
                        <p className="mb-2">Connect your Quo (formerly OpenPhone) number so Juniper can send and receive texts for you. Here's how:</p>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>
                            Create a Quo account and get a phone number at{' '}
                            <a
                              href="https://quo.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium underline hover:text-blue-900"
                            >
                              quo.com
                            </a>
                            .
                          </li>
                          <li>In Quo, register your number for business texting (this takes a couple of minutes to submit, then a few hours to get approved).</li>
                          <li>In Quo, go to Settings → API, create an API key, and copy it.</li>
                          <li>Paste the API key below.</li>
                        </ol>
                        <p className="mt-2">
                          Your API key lets Juniper send and read texts on your Quo number. Keep it private and don't share it. You can delete the key anytime in Quo's settings to disconnect.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="quo-api-key" className="text-sm font-medium text-blue-900">
                            API Key
                          </Label>
                          <Input
                            id="quo-api-key"
                            type="password"
                            placeholder="Your Quo API key"
                            value={quoApiKey}
                            onChange={(e) => setQuoApiKey(e.target.value)}
                            className="mt-1"
                            disabled={loadingStates['Quo']}
                          />
                        </div>
                        <div>
                          <Label htmlFor="quo-from-number" className="text-sm font-medium text-blue-900">
                            Default from number / phone number ID (optional)
                          </Label>
                          <Input
                            id="quo-from-number"
                            type="text"
                            placeholder="+15551234567 or phone number ID"
                            value={quoFromNumber}
                            onChange={(e) => setQuoFromNumber(e.target.value)}
                            className="mt-1"
                            disabled={loadingStates['Quo']}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowQuoForm(false);
                              setQuoApiKey('');
                              setQuoFromNumber('');
                            }}
                            disabled={loadingStates['Quo']}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleQuoSubmit}
                            disabled={loadingStates['Quo'] || !quoApiKey.trim()}
                            className="flex-1"
                          >
                            {loadingStates['Quo'] ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Connecting...
                              </>
                            ) : (
                              'Connect'
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quo inbound-pending state (outbound active, receiving texts pending) */}
                  {service.service_name === 'Quo' && quoConnectState?.inbound_state === 'pending' && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <h4 className="font-medium text-yellow-900">Sending active, receiving pending</h4>
                      </div>
                      <p className="text-sm text-yellow-800">{quoConnectState.message}</p>
                      {quoConnectState.inbound_error && (
                        <p className="text-xs text-yellow-700 mt-2">
                          Details: {quoConnectState.inbound_error}
                        </p>
                      )}
                      <p className="text-xs text-yellow-700 mt-2">
                        Juniper will automatically retry registering the inbound webhook once your
                        10DLC registration is complete in Quo. No further action is needed here.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuoConnectState(null)}
                        className="mt-3"
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}

                  {/* Android SMS Credential Form */}
                  {service.service_name === 'Android SMS' && showAndroidSmsForm && !service.isConnected && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Smartphone className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-blue-900">Android SMS Setup</h4>
                      </div>
                      <div className="text-sm text-blue-700 mb-4">
                        <p className="mb-2">Use your own Android phone to send and receive texts with Juniper. Here's how:</p>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>
                            Install the free SMS Gateway app from{' '}
                            <a
                              href="https://sms-gate.app"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium underline hover:text-blue-900"
                            >
                              sms-gate.app
                            </a>{' '}
                            on your Android phone.
                          </li>
                          <li>In the app, turn on "Cloud Server" mode.</li>
                          <li>The app shows a username and password — copy them.</li>
                          <li>Paste the username and password below.</li>
                        </ol>
                        <p className="mt-2">
                          These let Juniper send texts through your own phone, using your normal phone number and carrier plan. Keep your username and password private; you can change them in the app anytime.
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="android-sms-username" className="text-sm font-medium text-blue-900">
                            Username
                          </Label>
                          <Input
                            id="android-sms-username"
                            type="text"
                            placeholder="Your SMS Gateway username"
                            value={androidSmsUsername}
                            onChange={(e) => setAndroidSmsUsername(e.target.value)}
                            className="mt-1"
                            disabled={loadingStates['Android SMS']}
                          />
                        </div>
                        <div>
                          <Label htmlFor="android-sms-password" className="text-sm font-medium text-blue-900">
                            Password
                          </Label>
                          <Input
                            id="android-sms-password"
                            type="password"
                            placeholder="Your SMS Gateway password"
                            value={androidSmsPassword}
                            onChange={(e) => setAndroidSmsPassword(e.target.value)}
                            className="mt-1"
                            disabled={loadingStates['Android SMS']}
                          />
                        </div>
                        <div>
                          <Label htmlFor="android-sms-base-url" className="text-sm font-medium text-blue-900">
                            Server URL (leave blank for cloud)
                          </Label>
                          <Input
                            id="android-sms-base-url"
                            type="text"
                            placeholder="https://your-gateway-host:8080"
                            value={androidSmsBaseUrl}
                            onChange={(e) => setAndroidSmsBaseUrl(e.target.value)}
                            className="mt-1"
                            disabled={loadingStates['Android SMS']}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowAndroidSmsForm(false);
                              setAndroidSmsUsername('');
                              setAndroidSmsPassword('');
                              setAndroidSmsBaseUrl('');
                            }}
                            disabled={loadingStates['Android SMS']}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAndroidSmsSubmit}
                            disabled={loadingStates['Android SMS'] || !androidSmsUsername.trim() || !androidSmsPassword.trim()}
                            className="flex-1"
                          >
                            {loadingStates['Android SMS'] ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Connecting...
                              </>
                            ) : (
                              'Connect'
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Android SMS inbound-pending state (outbound active, receiving texts pending) */}
                  {service.service_name === 'Android SMS' && androidSmsConnectState?.inbound_state === 'pending' && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <h4 className="font-medium text-yellow-900">Sending active, receiving pending</h4>
                      </div>
                      <p className="text-sm text-yellow-800">{androidSmsConnectState.message}</p>
                      {androidSmsConnectState.inbound_error && (
                        <p className="text-xs text-yellow-700 mt-2">
                          Details: {androidSmsConnectState.inbound_error}
                        </p>
                      )}
                      <p className="text-xs text-yellow-700 mt-2">
                        Juniper will automatically retry registering the inbound webhook with your SMS
                        Gateway. No further action is needed here.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAndroidSmsConnectState(null)}
                        className="mt-3"
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}

                  {/* Action Button */}
                  {!(service.service_name === 'Textbelt' && showTextbeltForm && !service.isConnected) &&
                   !(service.service_name === 'Quo' && showQuoForm && !service.isConnected) &&
                   !(service.service_name === 'Android SMS' && showAndroidSmsForm && !service.isConnected) && (
                    <div className="mt-4">
                      {/* Special handling for mobile app only integrations */}
                      {['Apple Health', 'Google Health Connect', 'MyChart', 'Oura', 'Fitbit'].includes(service.service_name) ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <Smartphone className="w-3 h-3" />
                            <span>Mobile App Only</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={true}
                            className="w-full flex items-center gap-2 cursor-not-allowed opacity-60"
                          >
                            <Smartphone className="h-4 w-4" />
                            Connect in mobile app only
                          </Button>
                        </div>
                      ) : service.isConnected ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Connected</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReconnect(service)}
                              disabled={loadingStates[service.service_name]}
                              className="flex-1"
                            >
                              {loadingStates[service.service_name] ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Reconnecting...
                                </>
                              ) : (
                                <>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Reconnect
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDisconnect(service)}
                              disabled={loadingStates[service.service_name]}
                              className="flex-1"
                            >
                              {loadingStates[service.service_name] ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Disconnecting...
                                </>
                              ) : (
                                <>
                                  <Unplug className="h-4 w-4 mr-2" />
                                  Disconnect
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : service.isPendingSetup ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-yellow-600">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span>Setup In Progress</span>
                          </div>
                          <Button
                            onClick={() => handleConnect(service)}
                            disabled={loadingStates[service.service_name]}
                            className="w-full"
                          >
                            {loadingStates[service.service_name] ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Finalizing...
                              </>
                            ) : (
                              'Finalize Integration'
                            )}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleConnect(service)}
                          disabled={loadingStates[service.service_name]}
                          className="w-full flex items-center gap-2"
                        >
                          {loadingStates[service.service_name] ? (
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
                      )}
                    </div>
                  )}
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