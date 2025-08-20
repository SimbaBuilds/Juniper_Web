import { OAuthServiceConfig } from './OAuthConfig';

export interface TokenData {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  token_type?: string;
  scope?: string;
}

export interface AuthResult {
  success: boolean;
  tokens?: TokenData;
  error?: string;
}

export class BaseOAuthService {
  protected config: OAuthServiceConfig;
  protected serviceName: string;
  private authWindow: Window | null = null;

  constructor(serviceName: string, config: OAuthServiceConfig) {
    this.serviceName = serviceName;
    this.config = config;
  }

  generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  buildAuthUrl(state?: string): string {
    const params = new URLSearchParams();
    params.append('client_id', this.config.clientId);
    params.append('redirect_uri', this.config.redirectUri);
    params.append('response_type', 'code');
    
    if (this.config.scopes.length > 0) {
      params.append('scope', this.config.scopes.join(' '));
    }
    
    if (state) {
      params.append('state', state);
    }

    // Add additional params if specified
    if (this.config.additionalParams) {
      Object.entries(this.config.additionalParams).forEach(([key, value]) => {
        params.append(key, value);
      });
    }

    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  async buildAuthUrlWithPKCE(state?: string): Promise<{ url: string; codeVerifier: string }> {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    const params = new URLSearchParams();
    params.append('client_id', this.config.clientId);
    params.append('redirect_uri', this.config.redirectUri);
    params.append('response_type', 'code');
    params.append('code_challenge', codeChallenge);
    params.append('code_challenge_method', 'S256');
    
    if (this.config.scopes.length > 0) {
      params.append('scope', this.config.scopes.join(' '));
    }
    
    if (state) {
      params.append('state', state);
    }

    // Add additional params if specified
    if (this.config.additionalParams) {
      Object.entries(this.config.additionalParams).forEach(([key, value]) => {
        params.append(key, value);
      });
    }

    const url = `${this.config.authorizationUrl}?${params.toString()}`;
    return { url, codeVerifier };
  }

  async initiateAuth(): Promise<AuthResult> {
    try {
      let authUrl: string;
      let codeVerifier: string | undefined;

      const state = this.generateCodeVerifier(); // Use as random state

      if (this.config.usePKCE) {
        const pkceResult = await this.buildAuthUrlWithPKCE(state);
        authUrl = pkceResult.url;
        codeVerifier = pkceResult.codeVerifier;
        
        // Store code verifier for later use
        localStorage.setItem(`oauth_${this.serviceName}_code_verifier`, codeVerifier);
      } else {
        authUrl = this.buildAuthUrl(state);
      }

      // Store state for validation
      localStorage.setItem(`oauth_${this.serviceName}_state`, state);

      // Open OAuth window
      this.authWindow = window.open(
        authUrl,
        'oauth_window',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!this.authWindow) {
        throw new Error('Failed to open OAuth window. Please check your popup blocker settings.');
      }

      // Return a promise that resolves when the OAuth flow completes
      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (this.authWindow?.closed) {
            clearInterval(checkClosed);
            
            // Check if we received tokens (stored by callback)
            const tokens = this.getStoredTokens();
            if (tokens) {
              resolve({ success: true, tokens });
            } else {
              resolve({ success: false, error: 'OAuth flow was cancelled or failed' });
            }
          }
        }, 1000);

        // Timeout after 10 minutes
        setTimeout(() => {
          clearInterval(checkClosed);
          if (this.authWindow && !this.authWindow.closed) {
            this.authWindow.close();
          }
          reject(new Error('OAuth flow timed out'));
        }, 600000);
      });

    } catch (error) {
      console.error(`OAuth initiation failed for ${this.serviceName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async exchangeCodeForTokens(code: string, state?: string): Promise<AuthResult> {
    try {
      // Validate state if provided
      if (state) {
        const storedState = localStorage.getItem(`oauth_${this.serviceName}_state`);
        if (storedState !== state) {
          throw new Error('Invalid state parameter');
        }
        localStorage.removeItem(`oauth_${this.serviceName}_state`);
      }

      const body = new URLSearchParams();
      body.append('grant_type', 'authorization_code');
      body.append('client_id', this.config.clientId);
      body.append('code', code);
      body.append('redirect_uri', this.config.redirectUri);

      if (this.config.clientSecret) {
        body.append('client_secret', this.config.clientSecret);
      }

      // Handle PKCE
      if (this.config.usePKCE) {
        const codeVerifier = localStorage.getItem(`oauth_${this.serviceName}_code_verifier`);
        if (codeVerifier) {
          body.append('code_verifier', codeVerifier);
          localStorage.removeItem(`oauth_${this.serviceName}_code_verifier`);
        }
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      // Handle Basic Auth if required
      if (this.config.useBasicAuth && this.config.clientSecret) {
        const credentials = btoa(`${this.config.clientId}:${this.config.clientSecret}`);
        headers['Authorization'] = `Basic ${credentials}`;
      }

      // Add custom headers if specified
      if (this.config.customHeaders) {
        Object.assign(headers, this.config.customHeaders);
      }

      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers,
        body: body.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Token exchange failed for ${this.serviceName}:`, errorText);
        throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
      }

      const tokens: TokenData = await response.json();

      // Calculate expires_at if not provided
      if (tokens.expires_in && !tokens.expires_at) {
        tokens.expires_at = Date.now() / 1000 + tokens.expires_in;
      }

      // Store tokens
      await this.storeTokens(tokens);

      return { success: true, tokens };

    } catch (error) {
      console.error(`Token exchange failed for ${this.serviceName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token exchange failed'
      };
    }
  }

  async refreshTokens(): Promise<AuthResult> {
    try {
      const storedTokens = this.getStoredTokens();
      if (!storedTokens?.refresh_token) {
        throw new Error('No refresh token available');
      }

      const body = new URLSearchParams();
      body.append('grant_type', 'refresh_token');
      body.append('refresh_token', storedTokens.refresh_token);
      body.append('client_id', this.config.clientId);

      if (this.config.clientSecret) {
        body.append('client_secret', this.config.clientSecret);
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      if (this.config.useBasicAuth && this.config.clientSecret) {
        const credentials = btoa(`${this.config.clientId}:${this.config.clientSecret}`);
        headers['Authorization'] = `Basic ${credentials}`;
      }

      const response = await fetch(this.config.tokenUrl, {
        method: 'POST',
        headers,
        body: body.toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Token refresh failed for ${this.serviceName}:`, errorText);
        throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
      }

      const newTokens: TokenData = await response.json();

      // Keep existing refresh token if not provided
      if (!newTokens.refresh_token && storedTokens.refresh_token) {
        newTokens.refresh_token = storedTokens.refresh_token;
      }

      // Calculate expires_at if not provided
      if (newTokens.expires_in && !newTokens.expires_at) {
        newTokens.expires_at = Date.now() / 1000 + newTokens.expires_in;
      }

      await this.storeTokens(newTokens);

      return { success: true, tokens: newTokens };

    } catch (error) {
      console.error(`Token refresh failed for ${this.serviceName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed'
      };
    }
  }

  async getValidAccessToken(): Promise<string | null> {
    try {
      const tokens = this.getStoredTokens();
      if (!tokens?.access_token) {
        return null;
      }

      // Check if token is expired (with 5 minute buffer)
      if (tokens.expires_at && (tokens.expires_at - 300) <= (Date.now() / 1000)) {
        console.log(`Access token expired for ${this.serviceName}, attempting refresh`);
        
        const refreshResult = await this.refreshTokens();
        if (refreshResult.success && refreshResult.tokens) {
          return refreshResult.tokens.access_token;
        } else {
          console.error(`Token refresh failed for ${this.serviceName}`);
          return null;
        }
      }

      return tokens.access_token;
    } catch (error) {
      console.error(`Error getting valid access token for ${this.serviceName}:`, error);
      return null;
    }
  }

  async storeTokens(tokens: TokenData): Promise<void> {
    try {
      localStorage.setItem(`oauth_tokens_${this.serviceName}`, JSON.stringify(tokens));
    } catch (error) {
      console.error(`Failed to store tokens for ${this.serviceName}:`, error);
      throw new Error('Failed to store authentication tokens');
    }
  }

  getStoredTokens(): TokenData | null {
    try {
      const stored = localStorage.getItem(`oauth_tokens_${this.serviceName}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error(`Failed to retrieve tokens for ${this.serviceName}:`, error);
      return null;
    }
  }

  async clearStoredTokens(): Promise<void> {
    try {
      localStorage.removeItem(`oauth_tokens_${this.serviceName}`);
      localStorage.removeItem(`oauth_${this.serviceName}_state`);
      localStorage.removeItem(`oauth_${this.serviceName}_code_verifier`);
    } catch (error) {
      console.error(`Failed to clear tokens for ${this.serviceName}:`, error);
    }
  }

  isAuthenticated(): boolean {
    const tokens = this.getStoredTokens();
    return !!(tokens?.access_token);
  }

  async disconnect(): Promise<void> {
    await this.clearStoredTokens();
    
    // Dispatch custom event for UI updates
    const event = new CustomEvent('integration_disconnected', {
      detail: { serviceName: this.serviceName }
    });
    window.dispatchEvent(event);
  }
}