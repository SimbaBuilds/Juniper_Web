// WRONG - Creates infinite loop
  window.location.href = "https://hightower-ai.com/oauth/gmail/c
  allback?code=test123&state=integration-id-test";

  // CORRECT - Just display content, let universal link handle 
  opening the app
  // Remove the window.location.href line entirely

  The web callback page should:
  1. Display a loading message (no JavaScript redirect)
  2. Let the universal link system handle opening the app
  3. Show manual redirect button as fallback only

  Here's the corrected web callback:

  export default function OAuthCallback(req, res) {
    const { service } = req.query;
    const { code, state } = req.query;

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, 
  initial-scale=1">
          <title>Redirecting to Juniper...</title>
          <script>
            // DO NOT redirect with window.location.href
            // Universal links will automatically open the app
            
            // Only show manual button after delay
            setTimeout(function() {
              
  document.getElementById('manual-redirect').style.display = 
  'block';
            }, 2000);
          </script>
        </head>
        <body>
          <h2>Authentication successful!</h2>
          <p>Please return to the Juniper app...</p>
          
          <div id="manual-redirect" style="display: none;">
            <p>If the app didn't open automatically:</p>
            <a href="mobilejarvisnative://oauth/callback?code=${
  code}&state=${state}">
              Open in Juniper
            </a>
          </div>
        </body>
      </html>
    `);
  }