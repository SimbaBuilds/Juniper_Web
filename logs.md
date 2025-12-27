 POST /api/automations/trigger 401 in 437ms
Triggering manual automation via script-executor
  Automation ID: 477b35c8-9dd9-4f2e-9613-8675ba514cf4
  Automation Name: Manual Test Notification
  Payload: {
  "automation_id": "477b35c8-9dd9-4f2e-9613-8675ba514cf4",
  "trigger_data": {
    "trigger_type": "manual",
    "triggered_at": "2025-12-21T21:13:22.998Z",
    "triggered_by": "web_ui"
  },
  "test_mode": false
}
Automation 477b35c8-9dd9-4f2e-9613-8675ba514cf4 executed successfully: 121e82fc-a1ab-49a9-b896-d3933117e3e0
 POST /api/automations/trigger 200 in 2407ms
 ○ Compiling /automations ...
 ✓ Compiled /automations in 2.1s
 GET /automations 200 in 2969ms
 ✓ Compiled /favicon.ico in 157ms
 GET /favicon.ico?favicon.45db1c09.ico 200 in 385ms
 ✓ Compiled /api/user/update-timezone in 193ms
 POST /api/user/update-timezone 200 in 693ms
Triggering schedule_recurring automation via script-executor
  Automation ID: 920c4e41-9141-4188-9847-5744a7c20d19
  Automation Name: Evening Health Journal with AI Prompts
  Payload: {
  "automation_id": "920c4e41-9141-4188-9847-5744a7c20d19",
  "trigger_data": {
    "trigger_type": "manual",
    "triggered_at": "2025-12-22T01:55:55.780Z",
    "triggered_by": "web_ui"
  },
  "test_mode": false
}
Automation 920c4e41-9141-4188-9847-5744a7c20d19 executed successfully: bd63150b-43ab-4503-9731-c1a66dce0e30
 POST /api/automations/trigger 200 in 17467ms
 GET /automations 200 in 323ms
 GET /favicon.ico?favicon.45db1c09.ico 200 in 222ms
 POST /api/user/update-timezone 200 in 300ms
 ○ Compiling /chat ...
 ✓ Compiled /chat in 1241ms
 GET /chat 200 in 1424ms
 POST /api/user/update-timezone 200 in 251ms
 ✓ Compiled /api/chat in 302ms
Session check result: {
  hasSession: true,
  hasAccessToken: true,
  accessTokenLength: 970,
  sessionError: undefined
}
Using request ID: web-1766372324685-erwwfrh0h (provided by frontend)
[SERVER_REQUEST_SERVICE] Creating request record: {
  request_id: 'web-1766372324685-erwwfrh0h',
  request_type: 'chat',
  status: 'pending',
  conversation_id: '8aa43cff-ca94-4053-a155-10c95d0c1557',
  has_image: false,
  user_id: '56a2c117...',
  timestamp: '2025-12-22T02:58:45.395Z'
}
[SERVER_REQUEST_SERVICE] Request record created successfully: {
  request_id: 'web-1766372324685-erwwfrh0h',
  database_id: '9ba3cd17-732d-4b7f-b06c-d0b043c99ad4',
  conversation_id: '8aa43cff-ca94-4053-a155-10c95d0c1557',
  timestamp: '2025-12-22T02:58:45.552Z'
}
[SERVER_REQUEST_SERVICE] Updating request status: {
  request_id: 'web-1766372324685-erwwfrh0h',
  old_status: 'unknown',
  new_status: 'processing',
  has_metadata: false,
  timestamp: '2025-12-22T02:58:45.553Z'
}
[SERVER_REQUEST_SERVICE] Request status updated successfully: {
  request_id: 'web-1766372324685-erwwfrh0h',
  new_status: 'processing',
  conversation_id: '8aa43cff-ca94-4053-a155-10c95d0c1557',
  database_id: '9ba3cd17-732d-4b7f-b06c-d0b043c99ad4',
  timestamp: '2025-12-22T02:58:45.685Z'
}
Python backend success response: {
  hasResponse: true,
  responseLength: 1063,
  timestamp: 1766372369,
  settingsUpdated: false,
  integrationInProgress: false
}
[SERVER_REQUEST_SERVICE] Updating request status: {
  request_id: 'web-1766372324685-erwwfrh0h',
  old_status: 'unknown',
  new_status: 'completed',
  has_metadata: true,
  timestamp: '2025-12-22T02:59:29.563Z'
}
[SERVER_REQUEST_SERVICE] Request status updated successfully: {
  request_id: 'web-1766372324685-erwwfrh0h',
  new_status: 'completed',
  conversation_id: '8aa43cff-ca94-4053-a155-10c95d0c1557',
  database_id: '9ba3cd17-732d-4b7f-b06c-d0b043c99ad4',
  timestamp: '2025-12-22T02:59:29.732Z'
}
=== CHAT API REQUEST SUCCESS ===
 POST /api/chat 200 in 44872ms
 GET /automations 200 in 333ms
 POST /api/user/update-timezone 200 in 250ms
 ✓ Compiled in 512ms
 GET /automations 200 in 407ms
 GET /favicon.ico?favicon.45db1c09.ico 200 in 247ms
 POST /api/user/update-timezone 200 in 198ms
 GET /automations 200 in 186ms
 GET /favicon.ico?favicon.45db1c09.ico 200 in 225ms
 POST /api/user/update-timezone 200 in 207ms
 GET /automations 200 in 179ms
 GET /favicon.ico?favicon.45db1c09.ico 200 in 239ms
 POST /api/user/update-timezone 200 in 278ms
 GET /automations 200 in 184ms
 GET /favicon.ico?favicon.45db1c09.ico 200 in 229ms
 POST /api/user/update-timezone 200 in 222ms
 ✓ Compiled in 215ms
 ✓ Compiled in 181ms
 GET /automations 200 in 388ms
 GET /favicon.ico?favicon.45db1c09.ico 200 in 240ms
 POST /api/user/update-timezone 200 in 358ms
 ✓ Compiled in 210ms
 ✓ Compiled in 247ms
Triggering schedule_recurring automation via script-executor
  Automation ID: 5134c476-dbf0-4e13-bcbe-811edd0c5ff3
  Automation Name: Morning Oura Summary
  Payload: {
  "automation_id": "5134c476-dbf0-4e13-bcbe-811edd0c5ff3",
  "trigger_data": {
    "trigger_type": "manual",
    "triggered_at": "2025-12-22T14:47:20.038Z",
    "triggered_by": "web_ui"
  },
  "test_mode": false
}
Script executor error: 500 - {"success":false,"error":"FastAPI execution failed: 502 - <!DOCTYPE html>\n<html class=\"h-full\" lang=\"en-US\" dir=\"ltr\">\n  <head>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/euclid-square/EuclidSquare-Regular-WebS.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/euclid-square/EuclidSquare-RegularItalic-WebS.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/euclid-square/EuclidSquare-Medium-WebS.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/euclid-square/EuclidSquare-MediumItalic-WebS.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/ibm-plex-mono/IBMPlexMono-Text.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/ibm-plex-mono/IBMPlexMono-TextItalic.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/ibm-plex-mono/IBMPlexMono-SemiBoldItalic.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <meta name=\"author\" content=\"ngrok\">\n    <meta name=\"description\" content=\"ngrok is the fastest way to put anything on the internet with a single command.\">\n    <link href=\"https://ngrok.com/assets/favicon.ico\" rel=\"shortcut icon\" type=\"image/x-icon\">\n    <meta name=\"robots\" content=\"noindex, nofollow\">\n    <link id=\"style\" rel=\"stylesheet\" href=\"https://cdn.ngrok.com/static/css/error.css\">\n    <noscript>Traffic successfully made it to the ngrok agent, but the agent failed to establish a connection to the upstream web service at localhost:8000. (ERR_NGROK_8012)</noscript>\n    <script id=\"script\" src=\"https://cdn.ngrok.com/static/js/error.js\" type=\"text/javascript\"></script>\n  </head>\n  <body class=\"h-full\" id=\"ngrok\">\n    <div id=\"root\" data-payload=\"eyJhZGRyIjoibG9jYWxob3N0OjgwMDAiLCJjZG5CYXNlIjoiaHR0cHM6Ly9jZG4ubmdyb2suY29tLyIsImNvZGUiOiI4MDEyIiwiZXJyb3JUZXh0IjoiZGlhbCB0Y3AgWzo6MV06ODAwMDogY29ubmVjdDogY29ubmVjdGlvbiByZWZ1c2VkIiwibWVzc2FnZSI6IlRyYWZmaWMgc3VjY2Vzc2Z1bGx5IG1hZGUgaXQgdG8gdGhlIG5ncm9rIGFnZW50LCBidXQgdGhlIGFnZW50IGZhaWxlZCB0byBlc3RhYmxpc2ggYSBjb25uZWN0aW9uIHRvIHRoZSB1cHN0cmVhbSB3ZWIgc2VydmljZSBhdCBsb2NhbGhvc3Q6ODAwMC4iLCJzY2hlbWUiOiJodHRwIiwidGl0bGUiOiJCYWQgR2F0ZXdheSJ9\"></div>\n  </body>\n</html>\n"}
 POST /api/automations/trigger 500 in 938ms
Triggering schedule_recurring automation via script-executor
  Automation ID: 5134c476-dbf0-4e13-bcbe-811edd0c5ff3
  Automation Name: Morning Oura Summary
  Payload: {
  "automation_id": "5134c476-dbf0-4e13-bcbe-811edd0c5ff3",
  "trigger_data": {
    "trigger_type": "manual",
    "triggered_at": "2025-12-22T14:48:15.553Z",
    "triggered_by": "web_ui"
  },
  "test_mode": false
}
Script executor error: 500 - {"success":false,"error":"FastAPI execution failed: 502 - <!DOCTYPE html>\n<html class=\"h-full\" lang=\"en-US\" dir=\"ltr\">\n  <head>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/euclid-square/EuclidSquare-Regular-WebS.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/euclid-square/EuclidSquare-RegularItalic-WebS.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/euclid-square/EuclidSquare-Medium-WebS.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/euclid-square/EuclidSquare-MediumItalic-WebS.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/ibm-plex-mono/IBMPlexMono-Text.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/ibm-plex-mono/IBMPlexMono-TextItalic.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/ibm-plex-mono/IBMPlexMono-SemiBold.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <link rel=\"preload\" href=\"https://assets.ngrok.com/fonts/ibm-plex-mono/IBMPlexMono-SemiBoldItalic.woff\" as=\"font\" type=\"font/woff\" crossorigin=\"anonymous\" />\n    <meta name=\"author\" content=\"ngrok\">\n    <meta name=\"description\" content=\"ngrok is the fastest way to put anything on the internet with a single command.\">\n    <link href=\"https://ngrok.com/assets/favicon.ico\" rel=\"shortcut icon\" type=\"image/x-icon\">\n    <meta name=\"robots\" content=\"noindex, nofollow\">\n    <link id=\"style\" rel=\"stylesheet\" href=\"https://cdn.ngrok.com/static/css/error.css\">\n    <noscript>Traffic successfully made it to the ngrok agent, but the agent failed to establish a connection to the upstream web service at localhost:8000. (ERR_NGROK_8012)</noscript>\n    <script id=\"script\" src=\"https://cdn.ngrok.com/static/js/error.js\" type=\"text/javascript\"></script>\n  </head>\n  <body class=\"h-full\" id=\"ngrok\">\n    <div id=\"root\" data-payload=\"eyJhZGRyIjoibG9jYWxob3N0OjgwMDAiLCJjZG5CYXNlIjoiaHR0cHM6Ly9jZG4ubmdyb2suY29tLyIsImNvZGUiOiI4MDEyIiwiZXJyb3JUZXh0IjoiZGlhbCB0Y3AgWzo6MV06ODAwMDogY29ubmVjdDogY29ubmVjdGlvbiByZWZ1c2VkIiwibWVzc2FnZSI6IlRyYWZmaWMgc3VjY2Vzc2Z1bGx5IG1hZGUgaXQgdG8gdGhlIG5ncm9rIGFnZW50LCBidXQgdGhlIGFnZW50IGZhaWxlZCB0byBlc3RhYmxpc2ggYSBjb25uZWN0aW9uIHRvIHRoZSB1cHN0cmVhbSB3ZWIgc2VydmljZSBhdCBsb2NhbGhvc3Q6ODAwMC4iLCJzY2hlbWUiOiJodHRwIiwidGl0bGUiOiJCYWQgR2F0ZXdheSJ9\"></div>\n  </body>\n</html>\n"}
 POST /api/automations/trigger 500 in 1528ms
 GET /automations 200 in 352ms
 GET /favicon.ico?favicon.45db1c09.ico 200 in 224ms
 POST /api/user/update-timezone 200 in 241ms
Triggering schedule_recurring automation via script-executor
  Automation ID: 5134c476-dbf0-4e13-bcbe-811edd0c5ff3
  Automation Name: Morning Oura Summary
  Payload: {
  "automation_id": "5134c476-dbf0-4e13-bcbe-811edd0c5ff3",
  "trigger_data": {
    "trigger_type": "manual",
    "triggered_at": "2025-12-22T14:48:46.568Z",
    "triggered_by": "web_ui"
  },
  "test_mode": false
}
Automation 5134c476-dbf0-4e13-bcbe-811edd0c5ff3 executed successfully: d6d0b261-cb70-44ff-81cd-308c06c60aac
 POST /api/automations/trigger 200 in 12330ms
 ○ Compiling / ...
 ✓ Compiled / in 1531ms
 GET / 200 in 1571ms
 GET / 200 in 32ms
 ✓ Compiled /integration-descriptions in 342ms
 GET /integration-descriptions 200 in 373ms
 ✓ Compiled /api/services/public in 194ms
 GET /api/services/public 200 in 453ms
 GET /api/services/public 200 in 211ms
 ✓ Compiled in 308ms
 GET /integration-descriptions 200 in 230ms
 GET /favicon.ico?favicon.45db1c09.ico 200 in 225ms
 GET /api/services/public 200 in 294ms
 POST /api/user/update-timezone 200 in 250ms
 GET /integration-descriptions 200 in 76ms
 GET /favicon.ico?favicon.45db1c09.ico 200 in 234ms
 GET /api/services/public 200 in 244ms
 POST /api/user/update-timezone 200 in 235ms
 ✓ Compiled in 211ms
 GET / 200 in 46ms
 ○ Compiling /dashboard ...
 ✓ Compiled /dashboard in 843ms
 GET /dashboard 200 in 1319ms
 ✓ Compiled /integrations in 458ms
 GET /integrations 200 in 618ms
 POST /api/user/update-timezone 200 in 208ms
 ✓ Compiled /api/services in 348ms
Fetching integrations for user: 56a2c117-6486-4ca5-a57d-6c2e877e7083
Fetched services from database: 22
Services by type: { user: 17, system: 5 }
 GET /api/services 200 in 566ms
 GET /api/integrations/system?userId=56a2c117-6486-4ca5-a57d-6c2e877e7083 200 in 568ms
Found integrations: 17
 GET /api/integrations 200 in 606ms
 ✓ Compiled in 239ms
 GET / 200 in 53ms
 GET /integration-descriptions 200 in 131ms
 GET /api/services/public 200 in 392ms
 GET /api/services/public 200 in 284ms
 GET /dashboard 200 in 649ms
 GET /automations 200 in 174ms
 POST /api/user/update-timezone 200 in 236ms
 ✓ Compiled in 397ms
 ✓ Compiled in 128ms
 ✓ Compiled /automations in 42ms
 GET /automations 200 in 533ms
 GET /favicon.ico?favicon.45db1c09.ico 200 in 225ms
 POST /api/user/update-timezone 200 in 234ms
 ✓ Compiled in 209ms
 ✓ Compiled /automations in 21ms
 GET /automations 200 in 199ms
 ✓ Compiled in 164ms
 ✓ Compiled /automations in 20ms
 GET /automations 200 in 159ms
 ✓ Compiled in 134ms
 ✓ Compiled /automations in 12ms
 GET /automations 200 in 136ms
 GET /chat 200 in 222ms
 POST /api/user/update-timezone 200 in 246ms
 ○ Compiling /wellness ...
 ✓ Compiled /wellness in 2.9s
 GET /wellness 200 in 3186ms
 POST /api/user/update-timezone 200 in 308ms
 ✓ Compiled /api/user-wellness in 379ms
 GET /api/user-wellness 200 in 620ms
 GET /api/user-wellness 200 in 299ms
 GET /automations 200 in 202ms
 POST /api/user/update-timezone 200 in 233ms
Triggering manual automation via script-executor
  Automation ID: 477b35c8-9dd9-4f2e-9613-8675ba514cf4
  Automation Name: Manual Test Notification
  Payload: {
  "automation_id": "477b35c8-9dd9-4f2e-9613-8675ba514cf4",
  "trigger_data": {
    "trigger_type": "manual",
    "triggered_at": "2025-12-22T21:29:08.102Z",
    "triggered_by": "web_ui"
  },
  "test_mode": false
}
Automation 477b35c8-9dd9-4f2e-9613-8675ba514cf4 executed successfully: ab9316f0-2b04-49df-9b84-baadbad6f062
 POST /api/automations/trigger 200 in 2266ms
Triggering manual automation via script-executor
  Automation ID: 477b35c8-9dd9-4f2e-9613-8675ba514cf4
  Automation Name: Manual Test Notification
  Payload: {
  "automation_id": "477b35c8-9dd9-4f2e-9613-8675ba514cf4",
  "trigger_data": {
    "trigger_type": "manual",
    "triggered_at": "2025-12-22T21:29:33.459Z",
    "triggered_by": "web_ui"
  },
  "test_mode": false
}
Automation 477b35c8-9dd9-4f2e-9613-8675ba514cf4 executed successfully: bec521d7-932a-446b-bff2-0d34bf692401
 POST /api/automations/trigger 200 in 2144ms
 ✓ Compiled in 114ms
 GET /automations 200 in 323ms
 ✓ Compiled in 118ms
 GET /automations 200 in 34ms
 ✓ Compiled in 120ms
 GET /automations 200 in 48ms
 ✓ Compiled /chat in 153ms
 GET /chat 200 in 800ms
 POST /api/user/update-timezone 200 in 251ms
Session check result: {
  hasSession: true,
  hasAccessToken: true,
  accessTokenLength: 970,
  sessionError: undefined
}
Using request ID: web-1766447201750-7buwnbljh (provided by frontend)
[SERVER_REQUEST_SERVICE] Creating request record: {
  request_id: 'web-1766447201750-7buwnbljh',
  request_type: 'chat',
  status: 'pending',
  conversation_id: 'dbf11e0f-adfd-4379-84d1-e0eb283ac0b1',
  has_image: false,
  user_id: '56a2c117...',
  timestamp: '2025-12-22T23:46:42.232Z'
}
[SERVER_REQUEST_SERVICE] Request record created successfully: {
  request_id: 'web-1766447201750-7buwnbljh',
  database_id: '2ff5d85d-deaf-4042-b89f-2d454f073962',
  conversation_id: 'dbf11e0f-adfd-4379-84d1-e0eb283ac0b1',
  timestamp: '2025-12-22T23:46:42.377Z'
}
[SERVER_REQUEST_SERVICE] Updating request status: {
  request_id: 'web-1766447201750-7buwnbljh',
  old_status: 'unknown',
  new_status: 'processing',
  has_metadata: false,
  timestamp: '2025-12-22T23:46:42.377Z'
}
[SERVER_REQUEST_SERVICE] Request status updated successfully: {
  request_id: 'web-1766447201750-7buwnbljh',
  new_status: 'processing',
  conversation_id: 'dbf11e0f-adfd-4379-84d1-e0eb283ac0b1',
  database_id: '2ff5d85d-deaf-4042-b89f-2d454f073962',
  timestamp: '2025-12-22T23:46:42.515Z'
}
Python backend success response: {
  hasResponse: true,
  responseLength: 40,
  timestamp: 1766447219,
  settingsUpdated: true,
  integrationInProgress: false
}
[SERVER_REQUEST_SERVICE] Updating request status: {
  request_id: 'web-1766447201750-7buwnbljh',
  old_status: 'unknown',
  new_status: 'completed',
  has_metadata: true,
  timestamp: '2025-12-22T23:46:59.391Z'
}
[SERVER_REQUEST_SERVICE] Request status updated successfully: {
  request_id: 'web-1766447201750-7buwnbljh',
  new_status: 'completed',
  conversation_id: 'dbf11e0f-adfd-4379-84d1-e0eb283ac0b1',
  database_id: '2ff5d85d-deaf-4042-b89f-2d454f073962',
  timestamp: '2025-12-22T23:46:59.551Z'
}
=== CHAT API REQUEST SUCCESS ===
 POST /api/chat 200 in 17611ms
 GET /automations 200 in 283ms
 POST /api/user/update-timezone 200 in 242ms
Triggering manual automation via script-executor
  Automation ID: 477b35c8-9dd9-4f2e-9613-8675ba514cf4
  Automation Name: Manual Test Notification
  Payload: {
  "automation_id": "477b35c8-9dd9-4f2e-9613-8675ba514cf4",
  "trigger_data": {
    "trigger_type": "manual",
    "triggered_at": "2025-12-22T23:50:55.819Z",
    "triggered_by": "web_ui"
  },
  "test_mode": false
}
Automation 477b35c8-9dd9-4f2e-9613-8675ba514cf4 executed successfully: 20cdeaf7-8324-4b4e-8347-5d5bd10c906e
 POST /api/automations/trigger 200 in 2337ms
Triggering manual automation via script-executor
  Automation ID: 477b35c8-9dd9-4f2e-9613-8675ba514cf4
  Automation Name: Manual Test Notification
  Payload: {
  "automation_id": "477b35c8-9dd9-4f2e-9613-8675ba514cf4",
  "trigger_data": {
    "trigger_type": "manual",
    "triggered_at": "2025-12-22T23:51:05.499Z",
    "triggered_by": "web_ui"
  },
  "test_mode": false
}
Automation 477b35c8-9dd9-4f2e-9613-8675ba514cf4 executed successfully: e212e6f9-5a9d-424f-b228-469ed136a90d
 POST /api/automations/trigger 200 in 2181ms
 ✓ Compiled in 1302ms
 ✓ Compiled /automations in 30ms
 GET /automations 200 in 265ms
 GET /automations 200 in 35ms
 GET /automations 200 in 28ms
 GET /automations 200 in 40ms
 GET /automations 200 in 31ms
 ✓ Compiled in 415ms
 ✓ Compiled /automations in 14ms
 GET /automations 200 in 155ms
 GET /automations 200 in 32ms
 GET /automations 200 in 43ms
 GET /automations 200 in 28ms
 GET /automations 200 in 31ms
   Reload env: .env.local
   Reload env: .env.local
^C
cameronhightower@Mac juniper_web % npm run dev

> config_guide_site@0.1.0 dev
> next dev --turbopack

   ▲ Next.js 15.3.6 (Turbopack)
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.80:3000
   - Environments: .env.local

 ✓ Starting...
 ✓ Compiled middleware in 118ms
 ✓ Ready in 910ms
 ○ Compiling / ...
 ✓ Compiled / in 1360ms
 GET / 200 in 1609ms
 ✓ Compiled /api/user/update-timezone in 234ms
 POST /api/user/update-timezone 200 in 573ms
 ✓ Compiled /support in 354ms
 GET /support 200 in 422ms
 ✓ Compiled /api/contact in 185ms
[2025-12-23 02:03:39] DEBUG Creating transport: nodemailer (7.0.6; +https://nodemailer.com/; SMTP/7.0.6[client:7.0.6])
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] Resolved smtp.gmail.com as 142.250.114.108 [cache miss]
[2025-12-23 02:03:39] INFO  [37oliU7qHNw] Secure connection established to 142.250.114.108:465
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] S: 220 smtp.gmail.com ESMTP 46e09a7af769-7cc6673c32esm8590418a34.9 - gsmtp
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] C: EHLO Mac.lan
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] S: 250-smtp.gmail.com at your service, [72.177.68.233]
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] S: 250-SIZE 35882577
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] S: 250-8BITMIME
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] S: 250-AUTH LOGIN PLAIN XOAUTH2 PLAIN-CLIENTTOKEN OAUTHBEARER XOAUTH
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] S: 250-ENHANCEDSTATUSCODES
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] S: 250-PIPELINING
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] S: 250-CHUNKING
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] S: 250 SMTPUTF8
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] SMTP handshake finished
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] C: AUTH PLAIN AGNhbWVyb24uaGlnaHRvd2VyQHNpbWJhYnVpbGRzLmNvbQAvKiBzZWNyZXQgKi8=
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] S: 235 2.7.0 Accepted
[2025-12-23 02:03:39] INFO  [37oliU7qHNw] User "cameron.hightower@simbabuilds.com" authenticated
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] C: QUIT
SMTP connection verified successfully
[2025-12-23 02:03:39] DEBUG Sending mail using SMTP/7.0.6[client:7.0.6]
[2025-12-23 02:03:39] DEBUG [lrzOoDAe38] Resolved smtp.gmail.com as 142.250.114.108 [cache hit]
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] S: 221 2.0.0 closing connection 46e09a7af769-7cc6673c32esm8590418a34.9 - gsmtp
[2025-12-23 02:03:39] DEBUG [37oliU7qHNw] Closing connection to the server using "end"
[2025-12-23 02:03:39] INFO  [37oliU7qHNw] Connection closed
[2025-12-23 02:03:39] INFO  [lrzOoDAe38] Secure connection established to 142.250.114.108:465
[2025-12-23 02:03:39] DEBUG [lrzOoDAe38] S: 220 smtp.gmail.com ESMTP 46e09a7af769-7cc667ec281sm8244860a34.24 - gsmtp
[2025-12-23 02:03:39] DEBUG [lrzOoDAe38] C: EHLO Mac.lan
[2025-12-23 02:03:39] DEBUG [lrzOoDAe38] S: 250-smtp.gmail.com at your service, [72.177.68.233]
[2025-12-23 02:03:39] DEBUG [lrzOoDAe38] S: 250-SIZE 35882577
[2025-12-23 02:03:39] DEBUG [lrzOoDAe38] S: 250-8BITMIME
[2025-12-23 02:03:39] DEBUG [lrzOoDAe38] S: 250-AUTH LOGIN PLAIN XOAUTH2 PLAIN-CLIENTTOKEN OAUTHBEARER XOAUTH
[2025-12-23 02:03:39] DEBUG [lrzOoDAe38] S: 250-ENHANCEDSTATUSCODES
[2025-12-23 02:03:39] DEBUG [lrzOoDAe38] S: 250-PIPELINING
[2025-12-23 02:03:39] DEBUG [lrzOoDAe38] S: 250-CHUNKING
[2025-12-23 02:03:39] DEBUG [lrzOoDAe38] S: 250 SMTPUTF8
[2025-12-23 02:03:39] DEBUG [lrzOoDAe38] SMTP handshake finished
[2025-12-23 02:03:39] DEBUG [lrzOoDAe38] C: AUTH PLAIN AGNhbWVyb24uaGlnaHRvd2VyQHNpbWJhYnVpbGRzLmNvbQAvKiBzZWNyZXQgKi8=
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] S: 235 2.7.0 Accepted
[2025-12-23 02:03:40] INFO  [lrzOoDAe38] User "cameron.hightower@simbabuilds.com" authenticated
[2025-12-23 02:03:40] INFO  Sending message <cebea6ad-8cc5-b8ce-b241-aa5a38bb5940@simbabuilds.com> to <juniper@hightower-ai.com>
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] C: MAIL FROM:<cameron.hightower@simbabuilds.com>
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] S: 250 2.1.0 OK 46e09a7af769-7cc667ec281sm8244860a34.24 - gsmtp
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] C: RCPT TO:<juniper@hightower-ai.com>
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] S: 250 2.1.5 OK 46e09a7af769-7cc667ec281sm8244860a34.24 - gsmtp
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] C: DATA
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] S: 354 Go ahead 46e09a7af769-7cc667ec281sm8244860a34.24 - gsmtp
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] From: Juniper Contact Form <cameron.hightower@simbabuilds.com>
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] To: juniper@hightower-ai.com
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] Reply-To: cmrn.hightower@gmail.com
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] Subject: Juniper Contact Form: ewfwer
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] Message-ID: <cebea6ad-8cc5-b8ce-b241-aa5a38bb5940@simbabuilds.com>
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] Date: Tue, 23 Dec 2025 02:03:39 +0000
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] MIME-Version: 1.0
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] Content-Type: multipart/alternative;
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38]  boundary="--_NmP-7bed27a2add1ee11-Part_1"
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] 
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] ----_NmP-7bed27a2add1ee11-Part_1
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] Content-Type: text/plain; charset=utf-8
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] Content-Transfer-Encoding: 7bit
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] 
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] Name: Cameron Hightower
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] Email: cmrn.hightower@gmail.com
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] Subject: ewfwer
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] 
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] Message:
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] rghwrhwrh
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] ----_NmP-7bed27a2add1ee11-Part_1
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] Content-Type: text/html; charset=utf-8
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] Content-Transfer-Encoding: 7bit
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] 
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] 
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38]         <h2>New Contact Form Submission</h2>
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38]         <p><strong>Name:</strong> Cameron Hightower</p>
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38]         <p><strong>Email:</strong> cmrn.hightower@gmail.com</p>
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38]         <p><strong>Subject:</strong> ewfwer</p>
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38]         <p><strong>Message:</strong></p>
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38]         <p>rghwrhwrh</p>
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38]       
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] ----_NmP-7bed27a2add1ee11-Part_1--
[2025-12-23 02:03:40] DEBUG [lrzOoDAe38] .
[2025-12-23 02:03:40] INFO  [lrzOoDAe38] <1030 bytes encoded mime message (source size 1015 bytes)>
[2025-12-23 02:03:41] DEBUG [lrzOoDAe38] S: 250 2.0.0 OK  1766455421 46e09a7af769-7cc667ec281sm8244860a34.24 - gsmtp
[2025-12-23 02:03:41] DEBUG [lrzOoDAe38] Closing connection to the server using "end"
Message sent: <cebea6ad-8cc5-b8ce-b241-aa5a38bb5940@simbabuilds.com>
 POST /api/contact 200 in 2255ms
[2025-12-23 02:03:41] INFO  [lrzOoDAe38] Connection closed
[2025-12-23 02:04:31] DEBUG Creating transport: nodemailer (7.0.6; +https://nodemailer.com/; SMTP/7.0.6[client:7.0.6])
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] Resolved smtp.gmail.com as 142.250.114.108 [cache hit]
[2025-12-23 02:04:31] INFO  [QIUgKUhOqXQ] Secure connection established to 142.250.114.108:465
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] S: 220 smtp.gmail.com ESMTP 586e51a60fabf-3fdaabbadacsm7690064fac.15 - gsmtp
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] C: EHLO Mac.lan
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] S: 250-smtp.gmail.com at your service, [72.177.68.233]
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] S: 250-SIZE 35882577
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] S: 250-8BITMIME
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] S: 250-AUTH LOGIN PLAIN XOAUTH2 PLAIN-CLIENTTOKEN OAUTHBEARER XOAUTH
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] S: 250-ENHANCEDSTATUSCODES
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] S: 250-PIPELINING
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] S: 250-CHUNKING
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] S: 250 SMTPUTF8
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] SMTP handshake finished
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] C: AUTH PLAIN AGNhbWVyb24uaGlnaHRvd2VyQHNpbWJhYnVpbGRzLmNvbQAvKiBzZWNyZXQgKi8=
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] S: 235 2.7.0 Accepted
[2025-12-23 02:04:31] INFO  [QIUgKUhOqXQ] User "cameron.hightower@simbabuilds.com" authenticated
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] C: QUIT
SMTP connection verified successfully
[2025-12-23 02:04:31] DEBUG Sending mail using SMTP/7.0.6[client:7.0.6]
[2025-12-23 02:04:31] DEBUG [XPmzE0tc0] Resolved smtp.gmail.com as 142.250.114.108 [cache hit]
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] S: 221 2.0.0 closing connection 586e51a60fabf-3fdaabbadacsm7690064fac.15 - gsmtp
[2025-12-23 02:04:31] DEBUG [QIUgKUhOqXQ] Closing connection to the server using "end"
[2025-12-23 02:04:31] INFO  [QIUgKUhOqXQ] Connection closed
[2025-12-23 02:04:32] INFO  [XPmzE0tc0] Secure connection established to 142.250.114.108:465
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] S: 220 smtp.gmail.com ESMTP 5614622812f47-4598c356623sm677172b6e.2 - gsmtp
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] C: EHLO Mac.lan
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] S: 250-smtp.gmail.com at your service, [72.177.68.233]
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] S: 250-SIZE 35882577
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] S: 250-8BITMIME
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] S: 250-AUTH LOGIN PLAIN XOAUTH2 PLAIN-CLIENTTOKEN OAUTHBEARER XOAUTH
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] S: 250-ENHANCEDSTATUSCODES
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] S: 250-PIPELINING
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] S: 250-CHUNKING
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] S: 250 SMTPUTF8
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] SMTP handshake finished
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] C: AUTH PLAIN AGNhbWVyb24uaGlnaHRvd2VyQHNpbWJhYnVpbGRzLmNvbQAvKiBzZWNyZXQgKi8=
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] S: 235 2.7.0 Accepted
[2025-12-23 02:04:32] INFO  [XPmzE0tc0] User "cameron.hightower@simbabuilds.com" authenticated
[2025-12-23 02:04:32] INFO  Sending message <89f86ba1-e348-08bc-8839-3a4547d10a64@simbabuilds.com> to <juniper@hightower-ai.com>
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] C: MAIL FROM:<cameron.hightower@simbabuilds.com>
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] S: 250 2.1.0 OK 5614622812f47-4598c356623sm677172b6e.2 - gsmtp
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] C: RCPT TO:<juniper@hightower-ai.com>
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] S: 250 2.1.5 OK 5614622812f47-4598c356623sm677172b6e.2 - gsmtp
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] C: DATA
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] S: 354 Go ahead 5614622812f47-4598c356623sm677172b6e.2 - gsmtp
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] From: Juniper Contact Form <cameron.hightower@simbabuilds.com>
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] To: juniper@hightower-ai.com
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] Reply-To: cmrn.hightower@gmail.com
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] Subject: Juniper Contact Form: How does the new feature work?
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] Message-ID: <89f86ba1-e348-08bc-8839-3a4547d10a64@simbabuilds.com>
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] Date: Tue, 23 Dec 2025 02:04:31 +0000
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] MIME-Version: 1.0
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] Content-Type: multipart/alternative;
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0]  boundary="--_NmP-9a51423cef2384f2-Part_1"
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] 
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] ----_NmP-9a51423cef2384f2-Part_1
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] Content-Type: text/plain; charset=utf-8
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] Content-Transfer-Encoding: 7bit
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] 
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] Name: Cameron Hightower
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] Email: cmrn.hightower@gmail.com
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] Subject: How does the new feature work?
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] 
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] Message:
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] Need some help.
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] ----_NmP-9a51423cef2384f2-Part_1
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] Content-Type: text/html; charset=utf-8
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] Content-Transfer-Encoding: 7bit
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] 
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] 
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0]         <h2>New Contact Form Submission</h2>
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0]         <p><strong>Name:</strong> Cameron Hightower</p>
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0]         <p><strong>Email:</strong> cmrn.hightower@gmail.com</p>
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0]         <p><strong>Subject:</strong> How does the new feature work?</p>
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0]         <p><strong>Message:</strong></p>
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0]         <p>Need some help.</p>
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0]       
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] ----_NmP-9a51423cef2384f2-Part_1--
[2025-12-23 02:04:32] DEBUG [XPmzE0tc0] .
[2025-12-23 02:04:32] INFO  [XPmzE0tc0] <1114 bytes encoded mime message (source size 1099 bytes)>
[2025-12-23 02:04:33] DEBUG [XPmzE0tc0] S: 250 2.0.0 OK  1766455473 5614622812f47-4598c356623sm677172b6e.2 - gsmtp
[2025-12-23 02:04:33] DEBUG [XPmzE0tc0] Closing connection to the server using "end"
Message sent: <89f86ba1-e348-08bc-8839-3a4547d10a64@simbabuilds.com>
 POST /api/contact 200 in 2022ms
[2025-12-23 02:04:33] INFO  [XPmzE0tc0] Connection closed
