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
      const oauthService = this.getOAuthService(serviceName);
      if (!oauthService) {
        return { success: false, error: 'OAuth service not configured for this service' };
      }

      const result = await oauthService.initiateAuth();
      return result;

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
      const oauthService = this.getOAuthService(serviceName);
      if (!oauthService) {
        return { success: false, error: 'OAuth service not configured' };
      }

      // Exchange code for tokens
      const tokenResult = await oauthService.exchangeCodeForTokens(code, state);
      if (!tokenResult.success || !tokenResult.tokens) {
        return { success: false, error: tokenResult.error || 'Token exchange failed' };
      }

      // Get current user
      const { data: { user }, error: authError } = await this.supabase.auth.getUser();
      if (authError || !user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Create/update integration in database
      const integrationResult = await this.createOrUpdateIntegration(
        user.id,
        serviceName,
        tokenResult.tokens
      );

      if (!integrationResult.success) {
        return integrationResult;
      }

      // Trigger health data sync for health services
      if (serviceName === 'oura' || serviceName === 'fitbit') {
        this.triggerHealthDataSync(user.id, serviceName);
      }

      return integrationResult;

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
}