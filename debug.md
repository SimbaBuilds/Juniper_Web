Sending completion message for gmail to user f8ac1669-7e9e-4d9e-bb9d-bebd806ce58e
Error sending completion message: TypeError: Failed to parse URL from /api/chat
    at IntegrationCompletionService.sendCompletionMessage (app/lib/integrations/IntegrationCompletionService.ts:89:29)
    at GET (app/oauth/[service]/web-callback/route.ts:65:65)
  87 |       const message = `Let's complete the integration for ${serviceName}`;
  88 |       
> 89 |       const response = await fetch('/api/chat', {
     |                             ^
  90 |         method: 'POST',
  91 |         headers: {
  92 |           'Content-Type': 'application/json', {
  [cause]: TypeError: Invalid URL
      at IntegrationCompletionService.sendCompletionMessage (app/lib/integrations/IntegrationCompletionService.ts:89:29)
      at GET (app/oauth/[service]/web-callback/route.ts:65:65)
    87 |       const message = `Let's complete the integration for ${serviceName}`;
    88 |       
  > 89 |       const response = await fetch('/api/chat', {
       |                             ^
    90 |         method: 'POST',
    91 |         headers: {
    92 |           'Content-Type': 'application/json', {
    code: 'ERR_INVALID_URL',
    input: '/api/chat'
  }
}
Failed to send completion message, but integration was successful
 GET /oauth/gmail/web-callback?state=GW4OEtaW78jbNuUWjruXdQioAFRrFUuzdL6CQYedLoQ&code=4/0AVMBsJhkGbVa5P4n2uCKz01VapmJP8BkZUJu8xg_9FvIdyQwUyzxGju0AXYnMLj9tS87kQ&scope=https://www.googleapis.com/auth/gmail.readonly%20https://www.googleapis.