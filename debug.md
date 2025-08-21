 GET /api/integrations 200 in 214ms
Fetched services from database: 17
Services by type: { user: 15, system: 2 }
 GET /api/services 200 in 210ms
 POST /api/oauth/initiate 200 in 17ms
 ✓ Compiled /oauth/[service]/web-callback in 281ms
OAuth callback received for service: google-calendar { hasCode: true, hasState: true, hasError: false }
Integration failed for google-calendar: OAuth configuration not found for service
 GET /oauth/google-calendar/web-callback?state=d9mCc8OQPu1EutK3Cb9-TwdrC-kjKpTWdHG9T2D2fGc&code=4/0AVMBsJhhhYlWT4NTIcgxUqRHRjnyp2rKqc1wl2sOGIPvbf_1wjb_GVQ854v3_2KdLm1QZQ&scope=https://www.googleapis.com/auth/calendar.events 307 in 881ms
 GET /integrations?error=OAuth%20configuration%20not%20found%20for%20service&service=google-calendar 200 in 265ms
Fetching integrations for user: f8ac1669-7e9e-4d9e-bb9d-bebd806ce58e
Found integrations: 4

Available service names:
Oura
Fitbit
Microsoft Outlook Calendar
Textbelt
 Microsoft Word Online
 Slack
 Perplexity
 Notion
 Microsoft Teams
 Todoist
 Gmail
 Microsoft Excel Online
 Microsoft Outlook Mail
 Google Docs
 Google Calendar
 Google Sheets
 XAI Live Search
 