I am building out a scheduled and event driven automation feature for Juniper in the FASTAPI backend.  

In this project, I want a front end UI in an authenticated automations page where users can:

- view current automations
- pause an automation 
- manually trigger an automation (even if it is a scheduled or webhook based automation)



Please see the automation records in automation_records_rows.json.

Let me know if you have any clarifying questions.  You will probably need details on how to execute the automations.

Please do not enter plan mode or call a planning agent.



 Clarifying Questions:

  1. Triggering automations: What FastAPI endpoint should I call to manually trigger an automation? Something like POST 
  /automations/{id}/execute? What base URL and auth headers does it need?

This actually happens in a Supabase Edge Function called event-processor.  Can you access the Supabase Edge functions or do i need to provide them to you?

  2. Pausing automations: Is there an existing endpoint to update the active field, or should I create a Supabase direct update
   via a Next.js API route? (e.g., PATCH /automations/{id} with {active: boolean})

Would have to be direct

  3. Trigger display: For scheduled automations, should I show the next scheduled run time, or just the interval/config? For
  webhooks/polling, should I show the service name and event type?

All of that data sounds good - as much data as possible (within reason for non technical users), and please make appropriate values mutable by the user, including condiitonal values like > 70

  4. Execution history: Do you want to show any execution logs/history on this page, or just the current automation list with
  controls?


  Execution logs would make sense - maybe expandable and auto load 10 most recent with option to load more.  Example: automation_execution_logs_rows.json  - this is not comprehensive so please leave room for more data types and lean toward displaying raw field data


edge function reference in root: edge_function_reference/
