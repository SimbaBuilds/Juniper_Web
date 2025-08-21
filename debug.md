http://localhost:3001/integrations?error=OAuth%20configuration%20not%20found%20for%20service&service=outlook-mail



POST /api/oauth/initiate 200 in 356ms
 ✓ Compiled /oauth/[service]/web-callback in 188ms
OAuth callback received for service: outlook-mail { hasCode: true, hasState: true, hasError: false }
Integration failed for outlook-mail: OAuth configuration not found for service
 GET /oauth/outlook-mail/web-callback?code=M.C548_BAY.2.U.e84960a9-1f21-191f-77c9-107dda88db0a&state=-8WuhWBawBb0LCOZQoUOl9rIjIilSED6KFwYy9uQIYI 307 in 653ms
 ○ Compiling /integrations ...
 ✓ Compiled /integrations in 1189ms
 GET /integrations?error=OAuth%20configuration%20not%20found%20for%20service&service=outlook-mail 200 in 1462ms
 ✓ Compiled /api/integrations in 332ms
Fetching integrations for user: f8ac1669-7e9e-4d9e-bb9d-bebd806ce58e
 GET /api/integrations/system?userId=f8ac1669-7e9e-4d9e-bb9d-bebd806ce58e 200 in 661ms
Found integrations: 9
Integrations data: [
  {
    id: 'ff6e76b1-b534-45e0-8639-bbca71232d52',
    user_id: 'f8ac1669-7e9e-4d9e-bb9d-bebd806ce58e',
    configuration: { scopes: [Array] },
    is_active: true,
    last_used: '2025-08-21T02:32:20.637+00:00',
    created_at: '2025-08-21T02:32:21.080678+00:00',
    type: 'user_added',
    notes: null,
    access_token: 'EwBYBMl6BAAUBKgm8k1UswUNwklmy2v7U/S+1fEAAVXyJnzt92JYhSwJ/NEMkA6M6bJD6HwrT+/DlmdNTWv47swYYz9hhRocUtV9svUC3udEw/6hpbLAX7QXHL4rVBjTCXq3MeRIRW3Wj7oVup0yOlMHu1kDErEpjN3fvtJtMjaQzoOvI2yEt9k9sAJxb+BsucpaIaLkrklm53PRIE7J1LJdjENevq7IxlLcu0KjNZd+QTb6ARmRCL4zsv9mo1oWnChETBF7svP5o/jOkDKHUuMG+UjFC5o4P5RjUhtyKg9cYVJ17DfojNI7HlWs5caHg3dovQjcfzFBw4nS92TeYLwORPl2KQspiHCGq+Swzv05B+z0jVk1WrRHDDbFM6cQZgAAEHM9szIkTEj8pAr/9xg6oLogAwlif4c5PpLCbHa4mpGhoHKkpYGfekKkZnv2yP2MMDZ7RlM2OHRWkw7SV+iin7r535K6hNdy0lCdUtrVJWfnWl9AbHRC72GLhuwcOR6tgIGCUVE4G5N3uD8vmSoEXGUXE987UwLIfD2cERgLvyndCZYXGynEOHEMCQJCjQOLtXVvAByy9H2bgaRzrGYbSlEKFvEt9B1hfntZHHrjTVe3p+lGQpsB1cF4xhPbny0uXwY8xAXHjPuJoOLQUgHWOalPLxUZ5tGTR/u7XGI6hlfVZpl+ME+aBkGseib8TleEIO0DC3/OdPxlno3b0UU3SAOJ2d3sj807SErmYniHqpkah/3tzbGPtNpW55jmd9N+2DHDEWWwsLyZkgI0TqgWS9FPd0SVy6ofBZjWdx5oOQR7g97ADflKINBZTWEbmGB3Av2tlpdeIoYh3eYRtEaekyKm32dBoyawNe6RXZQJFr1hcZxw/VYOML22Vk3E6HTe9m7rodmKZqZsAgt3CTExXmEoOXAYdIkE6rw+lL9lRwpbz9fP41FiRdx0WyjjRkmJWtUJyevN0+KDpQVuLGozo8HWvoglRHcupFg0WCBvQqFLD4kFm0YBo5hSsH8ay++RpfsTgagObQ7gfw2cwDuLkxVdT5Ygxpt2oyBpgcwA/RLEo+pY/p9t8U5QIoVQyvPdssAuSMIdrfkD01pvKnkpObmCiU68PODk/Lq2jVhVIXy51D+lNreF0Ux87Aw+iALtdp4QdwdDB7hBmg8+qcXEzgzgAKmaEEhhGaRZTAkSfjmGuc3oyzCWfzOkQ5dWQ/qsmtsZw5L+te6DLFsW0ZO0kmDeCmg0Qp+OAkJ8x833f06vuUnOhcWC4pBCTZP96rPYC0jvObYHr6kkuTZwh3xQSS+ppaSeZKHWkrK3zKX+qUPR/HdT6q6Zop9Wve2yER5406LKRu7Sh/2/qHP4Dnih6puAXFH9ZimkQVIX+mfAlFzJHwj2MrSWRHO+5+WXx9Kg4AhQ0UMF+eVkOX51Gxqk1f0OnZ7fhxCqZpAJkvSWKY1BeT6Gpnb1ZgGIWfaKauo7xVXEbAM=',
    refresh_token: 'M.C548_BL2.0.U.-CoHeQ*kZPpWrXCy1XXnt9doknpBP3zIr2aXW*eBq6ZGdqaBVCvTQGtrX2XEJg1yGHS9ICjsbcJQpZxjlJxxy6PYrXey!UBXXcai7U5UI!gKEWxOh30NbTallCvNFm5sg!8WkR0Jv!rhME!V5VsKKZB3M8PjRFyJtTTan2yq5KxO1hg9RJjIRhyGhQGvfZbIKDWGh74SAzDPZ8mAEgMQ*DIYV8HaRrK7YrkgASAUOMUmEjr0gDp5uH*bRz5oLHL!ze3RMLSXqZA3YkwIAe7EssX*vvpHsmnensrxPprNK6xE9Uw4C0A0Zdp3KV7OWBXqZ3WodPsOLHlCRf34rN48N6VQJvUqgngKa4PO1M*zV6Xn88hhhrD84Lgi!VRV0YCzrA88dd31!TmRWgdBKfFhQgqFlDvPE0o4oVqQHmg5Ipztfln!TuRinQRSgrib4GiFyHQ$$',
    expires_at: '2025-08-21T03:32:19.637+00:00',
    scopes: null,
    email_address: null,
    sync_settings: {},
    bot_id: null,
    workspace_name: null,
    workspace_icon: null,
    workspace_id: null,
    owner_info: null,
    duplicated_template_id: null,
    permissions: null,
    last_sync: null,
    updated_at: '2025-08-21T02:32:20.637+00:00',
    integration_method: null,
    available_actions: null,
    connection_test_script: null,
    client_id: null,
    client_secret_id: null,
    client_secret_value: null,
    service_id: 'bffaa08c-614f-4839-ae5e-5c1a428267fa',
    status: 'active',
    api_key: null,
    scope: 'https://graph.microsoft.com/Files.ReadWrite.All https://graph.microsoft.com/Calendars.ReadWrite https://graph.microsoft.com/User.Read https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/Files.ReadWrite'
  },
  {
    id: '93e848f5-4dd9-46ff-a90

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
