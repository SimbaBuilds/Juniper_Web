import { createClient } from '@/lib/utils/supabase/client';
import { BaseOAuthService, TokenData } from './oauth/BaseOAuthService';
import { getOAuthConfig, getServiceDescriptor } from './oauth/OAuthConfig';

export interface Integration {
  id: string;
  user_id: string;
  service_name: string;
  status: 'pending' | 'active' | 'failed' | 'inactive';
  access_token?: string;
  refresh_token?: string;
  expires_at?: string;
  config?: Record<string, any>;
  last_used?: string;
  created_at: string;
  updated_at: string;
}

export interface IntegrationResult {
  success: boolean;
  integration?: Integration;
  error?: string;
}

export class IntegrationService {
  private supabase = createClient();

  async createOrUpdateIntegration(
    userId: string,
    serviceName: string,
    tokens: TokenData,
    config?: Record<string, any>
  ): Promise<IntegrationResult> {
    try {
      const now = new Date().toISOString();
      const expiresAt = tokens.expires_at 
        ? new Date(tokens.expires_at * 1000).toISOString()
        : null;

      const integrationData = {
        user_id: userId,
        service_name: serviceName,
        status: 'active' as const,
        is_active: true,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token || null,
        expires_at: expiresAt,
        config: config || {},
        last_used: now,
        updated_at: now,
      };

      // Upsert the integration
      const { data, error } = await this.supabase
        .from('integrations')
        .upsert(integrationData, {
          onConflict: 'user_id,service_name',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create/update integration:', error);
        return { success: false, error: error.message };
      }

      return { success: true, integration: data };

    } catch (error) {
      console.error('Error in createOrUpdateIntegration:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getIntegration(userId: string, serviceName: string): Promise<Integration | null> {
    try {
      const { data, error } = await this.supabase
        .from('integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('service_name', serviceName)
        .single();

      if (error) {
        console.error('Failed to get integration:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getIntegration:', error);
      return null;
    }
  }

  async getUserIntegrations(userId: string): Promise<Integration[]> {
    try {
      const { data, error } = await this.supabase
        .from('integrations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Failed to get user integrations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserIntegrations:', error);
      return [];
    }
  }

  async updateIntegrationStatus(
    userId: string,
    serviceName: string,
    status: Integration['status']
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('integrations')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('service_name', serviceName);

      if (error) {
        console.error('Failed to update integration status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateIntegrationStatus:', error);
      return false;
    }
  }

  async deleteIntegration(userId: string, serviceName: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('integrations')
        .delete()
        .eq('user_id', userId)
        .eq('service_name', serviceName);

      if (error) {
        console.error('Failed to delete integration:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteIntegration:', error);
      return false;
    }
  }

  async deleteIntegrationById(integrationId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('integrations')
        .delete()
        .eq('id', integrationId);

      if (error) {
        console.error('Failed to delete integration by ID:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteIntegrationById:', error);
      return false;
    }
  }

  async reconnectIntegration(integrationId: string, serviceName: string): Promise<IntegrationResult> {
    try {
      console.log(`🔄 Reconnecting ${serviceName} integration...`);

      // Map service name to internal format (like React Native)
      const serviceMap: Record<string, string> = {
        'Notion': 'notion',
        'Slack': 'slack', 
        'Gmail': 'gmail',
        'Google Calendar': 'google-calendar',
        'Google Docs': 'google-docs',
        'Google Sheets': 'google-sheets',
        'Microsoft Excel Online': 'microsoft-excel',
        'Microsoft Word Online': 'microsoft-word',
        'Microsoft Outlook Calendar': 'microsoft-outlook-calendar',
        'Microsoft Outlook Mail': 'microsoft-outlook-mail',
        'Microsoft Teams': 'microsoft-teams',
        'Todoist': 'todoist',
        'Fitbit': 'fitbit',
        'Oura': 'oura'
      };
      
      const internalServiceName = serviceMap[serviceName] || serviceName.toLowerCase().replace(/\s+/g, '-');
      console.log(`🔗 Mapped ${serviceName} to ${internalServiceName} for reconnection`);

      // Update status to pending and is_active to false (like React Native)
      const { error: updateError } = await this.supabase
        .from('integrations')
        .update({
          status: 'pending',
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', integrationId);

      if (updateError) {
        throw new Error(`Failed to update integration status: ${updateError.message}`);
      }

      // Start OAuth flow with existing integration ID (skip completion message for reconnect)
      const result = await this.initiateOAuth(internalServiceName);
      
      return result;

    } catch (error) {
      console.error(`❌ Error reconnecting ${serviceName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async refreshIntegrationTokens(userId: string, serviceName: string): Promise<boolean> {
    try {
      const integration = await this.getIntegration(userId, serviceName);
      if (!integration) {
        console.error('Integration not found for token refresh');
        return false;
      }

      const config = getOAuthConfig(serviceName);
      if (!config) {
        console.error('OAuth config not found for service:', serviceName);
        return false;
      }

      const oauthService = new BaseOAuthService(serviceName, config);
      
      // Store current tokens in localStorage for refresh
      if (integration.access_token) {
        const tokens: TokenData = {
          access_token: integration.access_token,
          refresh_token: integration.refresh_token || undefined,
          expires_at: integration.expires_at 
            ? Math.floor(new Date(integration.expires_at).getTime() / 1000)
            : undefined
        };
        await oauthService.storeTokens(tokens);
      }

      const refreshResult = await oauthService.refreshTokens();
      if (!refreshResult.success || !refreshResult.tokens) {
        await this.updateIntegrationStatus(userId, serviceName, 'failed');
        return false;
      }

      // Update integration with new tokens
      const updateResult = await this.createOrUpdateIntegration(
        userId,
        serviceName,
        refreshResult.tokens,
        integration.config
      );

      return updateResult.success;

    } catch (error) {
      console.error('Error refreshing integration tokens:', error);
      return false;
    }
  }

  getOAuthService(serviceName: string): BaseOAuthService | null {
    const config = getOAuthConfig(serviceName);
    if (!config) {
      return null;
    }
    return new BaseOAuthService(serviceName, config);
  }

  async initiateOAuth(serviceName: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Call server-side API to get OAuth URL
      const response = await fetch('/api/oauth/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Failed to initiate OAuth' };
      }

      const { authUrl, state, codeVerifier, usePKCE } = await response.json();

      // Store state and code verifier for later validation
      localStorage.setItem(`oauth_${serviceName}_state`, state);
      if (usePKCE && codeVerifier) {
        localStorage.setItem(`oauth_${serviceName}_code_verifier`, codeVerifier);
      }

      // Open OAuth window
      const authWindow = window.open(
        authUrl,
        'oauth_window',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!authWindow) {
        return { success: false, error: 'Failed to open OAuth window. Please check your popup blocker settings.' };
      }

      // Return a promise that resolves when the OAuth flow completes
      return new Promise((resolve) => {
        const checkClosed = setInterval(() => {
          if (authWindow.closed) {
            clearInterval(checkClosed);
            
            // Check if we received tokens (stored by callback)
            const tokens = this.getStoredTokens(serviceName);
            if (tokens) {
              resolve({ success: true });
            } else {
              resolve({ success: false, error: 'OAuth flow was cancelled or failed' });
            }
          }
        }, 1000);

        // Timeout after 10 minutes
        setTimeout(() => {
          clearInterval(checkClosed);
          if (!authWindow.closed) {
            authWindow.close();
          }
          resolve({ success: false, error: 'OAuth flow timed out' });
        }, 600000);
      });

    } catch (error) {
      console.error('Error initiating OAuth:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async handleOAuthCallback(
    serviceName: string,
    code: string,
    state?: string
  ): Promise<IntegrationResult> {
    try {
      // Call server-side API to exchange code for tokens and create integration
      const response = await fetch('/api/oauth/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceName, code, state }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Token exchange failed' };
      }

      const result = await response.json();
      return { success: true, integration: result.integration };

    } catch (error) {
      console.error('Error handling OAuth callback:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'OAuth callback failed'
      };
    }
  }

  private async triggerHealthDataSync(userId: string, serviceName: string): Promise<void> {
    try {
      console.log(`Triggering health data sync for ${serviceName}`);
      
      const response = await fetch('/api/integrations/health-data-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'backfill',
          user_id: userId,
          service_name: serviceName,
          days: 7
        }),
      });

      if (!response.ok) {
        console.error('Health data sync failed:', await response.text());
      } else {
        console.log('Health data sync triggered successfully');
      }

      // For Fitbit, also set up webhooks
      if (serviceName === 'fitbit') {
        this.setupFitbitWebhooks(userId);
      }

    } catch (error) {
      console.error('Error triggering health data sync:', error);
    }
  }

  private async setupFitbitWebhooks(userId: string): Promise<void> {
    try {
      console.log('Setting up Fitbit webhooks');
      
      const collections = ['activities', 'sleep', 'body', 'foods'];
      
      for (const collection of collections) {
        const response = await fetch('/api/integrations/fitbit-webhook', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'subscribe',
            user_id: userId,
            collection
          }),
        });

        if (!response.ok) {
          console.error(`Fitbit webhook setup failed for ${collection}:`, await response.text());
        }
      }

    } catch (error) {
      console.error('Error setting up Fitbit webhooks:', error);
    }
  }

  isHealthService(serviceName: string): boolean {
    return serviceName === 'oura' || serviceName === 'fitbit';
  }

  isCredentialBasedService(serviceName: string): boolean {
    return serviceName === 'twilio' || serviceName === 'textbelt';
  }

  getServiceDisplayInfo(serviceName: string) {
    return getServiceDescriptor(serviceName);
  }

  getStoredTokens(serviceName: string): TokenData | null {
    try {
      const stored = localStorage.getItem(`oauth_tokens_${serviceName}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error(`Failed to retrieve tokens for ${serviceName}:`, error);
      return null;
    }
  }
}