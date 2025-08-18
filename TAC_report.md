1. Verify documentation and justification of all the application's trust boundaries, components, and significant data flows.

Yes
No
Next.js web application with Supabase backend. Client-server architecture with clear separation of concerns, JWT-based authentication, server-side API routes for sensitive operations.
2. Verify the application does not use unsupported, insecure, or deprecated client-side technologies such as NSAPI plugins, Flash, Shockwave, ActiveX, Silverlight, NACL, or client-side Java applets.

Yes
No
Built with Next.js and React using modern TypeScript/JavaScript. No Flash, ActiveX, Silverlight, or deprecated browser plugins used.
3. Verify that trusted enforcement points, such as access control gateways, servers, and serverless functions, enforce access controls. Never enforce access controls on the client.

Yes
No
Access control enforced via Supabase Row Level Security policies and Next.js middleware. Client-side React components handle UI only, all authorization decisions made server-side.
4. Verify that all sensitive data is identified and classified into protection levels.

Yes
No
HIGH: Authentication tokens, user credentials (secure session storage); MEDIUM: User preferences, chat history, wellness data (encrypted transit); LOW: Public profile data, integration descriptions.
5. Verify that all protection levels have an associated set of protection requirements, such as encryption requirements, integrity requirements, retention, privacy and other confidentiality requirements, and that these are applied in the architecture.

Yes
No
HIGH: AES-256 encryption at rest, TLS 1.3, secure session management; MEDIUM: HTTPS-only transmission, authenticated API access; LOW: Standard HTTPS with CDN protection.

6. Verify that the application employs integrity protections, such as code signing or subresource integrity. The application must not load or execute code from untrusted sources, such as loading includes, modules, plugins, code, or libraries from untrusted sources or the Internet.

Yes
No
Next.js build process provides static bundling and dependency integrity checks. All dependencies from npm registry with package-lock.json for reproducible builds, no untrusted code sources.

7. Verify that the application has protection from subdomain takeovers if the application relies upon DNS entries or DNS subdomains, such as expired domain names, out of date DNS pointers or CNAMEs, expired projects at public source code repos, or transient cloud APIs, serverless functions, or storage buckets (*autogen-bucket-id*.cloud.example.com) or similar. Protections can include ensuring that DNS names used by applications are regularly checked for expiry or change.

Yes
No
Using Vercel hosting with managed DNS and Supabase hosted infrastructure. All subdomains controlled through verified hosting providers, no dangling DNS records.

8. Verify that the application has anti-automation controls to protect against excessive calls such as mass data exfiltration, business logic requests, file uploads or denial of service attacks.

Yes
No
Supabase provides built-in rate limiting and Next.js middleware implements request throttling. API routes protected by authentication, RLS policies prevent unauthorized mass operations.

9. Verify that files obtained from untrusted sources are stored outside the web root, with limited permissions.

Yes
No
File uploads handled by Supabase Storage with RLS policies, stored outside web root with restricted access permissions.

10. Verify that files obtained from untrusted sources are scanned by antivirus scanners to prevent upload and serving of known malicious content.

Yes
No
File uploads managed by Supabase secure infrastructure with built-in malware scanning and content filtering.
11. Verify API URLs do not expose sensitive information, such as the API key, session tokens etc.

Yes
No
Only public anonymous keys exposed in client-side code. Session tokens managed via secure HTTP-only cookies, never exposed in URLs or query parameters.

12. Verify that authorization decisions are made at both the URI, enforced by programmatic or declarative security at the controller or router, and at the resource level, enforced by model-based permissions.

Yes
No
Route-level authorization enforced by Next.js middleware and protected route layouts, resource-level permissions via Supabase RLS policies.

13. Verify that enabled RESTful HTTP methods are a valid choice for the user or action, such as preventing normal users using DELETE or PUT on protected API or resources.

Yes
No
Next.js API routes validate HTTP methods and user permissions. Supabase client library with RLS policies enforces appropriate operations based on user roles.

14. Verify that the application build and deployment processes are performed in a secure and repeatable way, such as CI / CD automation, automated configuration management, and automated deployment scripts.

Yes
No
Vercel deployment pipeline provides automated CI/CD with secure environment variable management and reproducible builds from Git commits.

15. Verify that the application, configuration, and all dependencies can be re-deployed using automated deployment scripts, built from a documented and tested runbook in a reasonable time, or restored from backups in a timely fashion.

Yes
No
Vercel provides automated deployments with instant rollback capabilities. All dependencies and configurations version-controlled for reproducible deployments.

16. Verify that authorized administrators can verify the integrity of all security-relevant configurations to detect tampering.

Yes
No
Environment variables managed through Vercel dashboard with access logging. Configuration files version-controlled with Next.js providing build-time validation.

17. Verify that web or application server and application framework debug modes are disabled in production to eliminate debug features, developer consoles, and unintended security disclosures.

Yes
No
Next.js production builds automatically disable debug mode and development tools. Console statements removed in production bundles.

18. Verify that the supplied Origin header is not used for authentication or access control decisions, as the Origin header can easily be changed by an attacker.

Yes
No
Origin header not used for authentication decisions. All authentication and authorization based on secure session tokens and JWT validation.

19. Verify that cookie-based session tokens utilize the 'SameSite' attribute to limit exposure to cross-site request forgery attacks. ([C6](https://owasp.org/www-project-proactive-controls/#div-numbering))

Yes
No
Supabase Auth automatically sets SameSite on session cookies via the middleware configuration.
20. Verify that the application protects against LDAP injection vulnerabilities, or that specific security controls to prevent LDAP injection have been implemented. ([C4](https://owasp.org/www-project-proactive-controls/#div-numbering))

Yes
No
No LDAP endpoints exposed - all authentication routed through Supabase Auth with proper session validation.
21. Verify that the application protects against Local File Inclusion (LFI) or Remote File Inclusion (RFI) attacks.

Yes
No
Next.js static bundling prevents dynamic file inclusion. All imports are resolved at build time.
22
22. Verify that regulated private data is stored encrypted while at rest, such as Personally Identifiable Information (PII), sensitive personal information, or data assessed likely to be subject to EU's GDPR.

Yes
No
Supabase provides AES-256 encryption at rest for all database data and user authentication tokens.
23. Verify that all cryptographic operations are constant-time, with no 'short-circuit' operations in comparisons, calculations, or returns, to avoid leaking information.

Yes
No
Supabase Auth service and Node.js crypto primitives implement constant-time string comparisons for all authentication operations.
