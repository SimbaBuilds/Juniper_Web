○ Compiling /api/stripe/webhook ...
 ✓ Compiled /api/stripe/webhook in 836ms
Webhook Secret: whsec...
Raw Body Length: 5477
Raw Body Type: string
First 100 chars of Raw Body: {
  "id": "evt_1RtyuEP3MuCplnDXEFtqKPQn",
  "object": "event",
  "api_version": "2024-12-18.acacia",
Event successfully constructed: customer.subscription.created
🔄 Processing subscription event: {
  eventType: 'customer.subscription.created',
  subscriptionId: 'sub_1RtyuCP3MuCplnDXWA1ely0j',
  customerId: 'cus_SpeCLI5Nk13jxF',
  status: 'active',
  periodEnd: '2025-09-08T22:36:56.000Z',
  cancelAtPeriodEnd: false
}
🔍 Testing database connectivity...
❌ Database connectivity test failed: {
  code: 'PGRST100',
  details: `unexpected '(' expecting letter, digit, "-", "->>", "->", "::", ".", ")", "," or end of input`,
  hint: null,
  message: '"failed to parse select parameter (count(*))" (line 1, column 6)'
}
 POST /api/stripe/webhook 200 in 1161ms
Webhook Secret: whsec...
Raw Body Length: 5477
Raw Body Type: string
First 100 chars of Raw Body: {
  "id": "evt_1RtyuEP3MuCplnDXEFtqKPQn",
  "object": "event",
  "api_version": "2024-12-18.acacia",
Event successfully constructed: customer.subscription.created
🔄 Processing subscription event: {
  eventType: 'customer.subscription.created',
  subscriptionId: 'sub_1RtyuCP3MuCplnDXWA1ely0j',
  customerId: 'cus_SpeCLI5Nk13jxF',
  status: 'active',
  periodEnd: '2025-09-08T22:36:56.000Z',
  cancelAtPeriodEnd: false
}
🔍 Testing database connectivity...
❌ Database connectivity test failed: {
  code: 'PGRST100',
  details: `unexpected '(' expecting letter, digit, "-", "->>", "->", "::", ".", ")", "," or end of input`,
  hint: null,
  message: '"failed to parse select parameter (count(*))" (line 1, column 6)'
}
 POST /api/stripe/webhook 200 in 214ms
Webhook Secret: whsec...
Raw Body Length: 7774
Raw Body Type: string
First 100 chars of Raw Body: {
  "id": "evt_1RtyuFP3MuCplnDXUnaSF5jM",
  "object": "event",
  "api_version": "2024-12-18.acacia",
Event successfully constructed: invoice.paid
🔄 Processing invoice payment event: {
  eventType: 'invoice.paid',
  invoiceId: 'in_1RtyuCP3MuCplnDXUS1aP5wx',
  subscriptionId: 'sub_1RtyuCP3MuCplnDXWA1ely0j',
  customerId: 'cus_SpeCLI5Nk13jxF',
  status: 'paid'
}
🔍 Looking up user for invoice payment by customer ID: cus_SpeCLI5Nk13jxF
❌ Failed to find user profile for invoice payment: {
  error: {
    code: 'PGRST116',
    details: 'The result contains 0 rows',
    hint: null,
    message: 'JSON object requested, multiple (or no) rows returned'
  },
  customerId: 'cus_SpeCLI5Nk13jxF',
  subscriptionId: 'sub_1RtyuCP3MuCplnDXWA1ely0j'
}
 POST /api/stripe/webhook 200 in 553ms
Webhook Secret: whsec...
Raw Body Length: 5816
Raw Body Type: string
First 100 chars of Raw Body: {
  "id": "evt_1RtyrWP3MuCplnDXFmDtzmE1",
  "object": "event",
  "api_version": "2024-12-18.acacia",
Event successfully constructed: customer.subscription.created
🔄 Processing subscription event: {
  eventType: 'customer.subscription.created',
  subscriptionId: 'sub_1RtyrUP3MuCplnDX4ynWOPC2',
  customerId: 'cus_Spe7B7ByRRT8yT',
  status: 'active',
  periodEnd: '2025-09-08T22:34:06.000Z',
  cancelAtPeriodEnd: false
}
🔍 Testing database connectivity...
❌ Database connectivity test failed: {
  code: 'PGRST100',
  details: `unexpected '(' expecting letter, digit, "-", "->>", "->", "::", ".", ")", "," or end of input`,
  hint: null,
  message: '"failed to parse select parameter (count(*))" (line 1, column 6)'
}
 POST /api/stripe/webhook 200 in 343ms
