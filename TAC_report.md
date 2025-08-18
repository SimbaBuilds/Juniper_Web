1 097. Reverse tabnabbing
Severity Level: Critical
CWEID: CWE-502
Status: Open
Description:
Use of window.open() method without "noopener, noreferrer" window features allows target page to change the
contents of original page. in None/juniper_sast_submission/web/app/components/subscription/subscriptionmanager.tsx
Reference: https://docs.fluidattacks.com/criteria/vulnerabilities/097

1. DOM-Based cross-site scripting (XSS)
Severity Level: Medium
CWEID: CWE-79
Status: Open
Description:
Use of DangerouslySetInnerHtml, which is known as insecure in
None/juniper_sast_submission/web/components/ui/chart.tsx