export interface IntegrationCompletionHandler {
  sendTextMessage: (message: string, integrationInProgress?: boolean, imageUrl?: string) => Promise<void>;
  navigateToHome: () => void;
}

class IntegrationCompletionService {
  private static instance: IntegrationCompletionService;
  private handler: IntegrationCompletionHandler | null = null;

  static getInstance(): IntegrationCompletionService {
    if (!IntegrationCompletionService.instance) {
      IntegrationCompletionService.instance = new IntegrationCompletionService();
    }
    return IntegrationCompletionService.instance;
  }

  /**
   * Set the handler that will process integration completions
   * This should be called from a React component that has access to chat functionality and navigation
   */
  setHandler(handler: IntegrationCompletionHandler) {
    this.handler = handler;
    console.log('✅ Integration completion handler registered');
  }

  /**
   * Complete an integration by sending a message and navigating home
   */
  async completeIntegration(serviceName: string) {
    console.log(`🔗 Completing integration for ${serviceName}`);
    
    if (!this.handler) {
      console.error('❌ No integration completion handler registered');
      // Dispatch a custom event as a fallback for web environment
      this.dispatchIntegrationEvent(serviceName);
      return;
    }

    try {
      // Send text message to assistant with integration_in_progress flag
      const message = `Let's complete the integration for ${serviceName}`;
      await this.handler.sendTextMessage(message, true);
      
      // Navigate to home screen
      this.handler.navigateToHome();
      
      console.log(`✅ Integration completion flow triggered for ${serviceName}`);
    } catch (error) {
      console.error(`❌ Error completing integration for ${serviceName}:`, error);
      // Dispatch an event as a fallback
      this.dispatchIntegrationEvent(serviceName, error);
    }
  }

  /**
   * Dispatch a custom event for integration completion (web fallback)
   */
  private dispatchIntegrationEvent(serviceName: string, error?: any) {
    const event = new CustomEvent('integrationCompleted', {
      detail: { serviceName, error }
    });
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(event);
    }
  }
}

export default IntegrationCompletionService;