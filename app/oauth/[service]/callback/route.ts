import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { service: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  const service = params.service;

  // Build the callback URL with all parameters
  const callbackParams = new URLSearchParams();
  if (code) callbackParams.append('code', code);
  if (state) callbackParams.append('state', state);
  if (error) callbackParams.append('error', error);
  if (errorDescription) callbackParams.append('error_description', errorDescription);
  
  const callbackUrl = `https://hightower-ai.com/oauth/${service}/callback?${callbackParams.toString()}`;

  // Build the deep link for manual fallback
  const deepLinkParams = new URLSearchParams();
  if (code) deepLinkParams.append('code', code);
  if (state) deepLinkParams.append('state', state);
  if (error) deepLinkParams.append('error', error);
  if (errorDescription) deepLinkParams.append('error_description', errorDescription);
  
  const deepLink = `mobilejarvisnative://oauth/callback?${deepLinkParams.toString()}`;

  // Return HTML that lets universal links handle automatic opening
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Redirecting to Juniper...</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
            padding: 50px 20px;
            background-color: #f5f5f5;
            margin: 0;
          }
          .container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h2 {
            color: #333;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: #007AFF;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            transition: background 0.2s;
          }
          .button:hover {
            background: #0056b3;
          }
          .spinner {
            width: 40px;
            height: 40px;
            margin: 0 auto 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #007AFF;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .error {
            color: #d32f2f;
            margin-bottom: 20px;
          }
        </style>
        <script>
          // DO NOT redirect with window.location.href
          // Universal links will automatically open the app
          
          // Only show manual button after delay
          setTimeout(function() {
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('manual-redirect').style.display = 'block';
          }, 2000);
        </script>
      </head>
      <body>
        <div class="container">
          <div id="spinner" class="spinner"></div>
          <h2>Authentication successful!</h2>
          <p>Please return to the Juniper app...</p>
          
          ${error ? `<p class="error">Error: ${errorDescription || error}</p>` : ''}
          
          <div id="manual-redirect" style="display: none;">
            <p>If the app didn't open automatically:</p>
            <a href="${deepLink}" class="button">
              Open in Juniper
            </a>
          </div>
        </div>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}