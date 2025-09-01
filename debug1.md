 ✓ Compiled /api/contact in 173ms
nodemailer object: [Object: null prototype] [Module] {
  createTransport: [Getter],
  createTestAccount: [Getter],
  getTestMessageUrl: [Getter],
  default: [Getter]
}
SMTP Error: Error: createTransporter is not a function
    at POST (app/api/contact/route.ts:26:12)
  24 |     if (typeof createTransporter !== 'function') {
  25 |       console.error('nodemailer object:', nodemailer)
> 26 |       throw new Error('createTransporter is not a function')
     |            ^
  27 |     }
  28 |     
  29 |     // Create transporter inside the POST function
Error details: {
  message: 'createTransporter is not a function',
  stack: 'Error: createTransporter is not a function\n' +
    '    at POST (/Users/cameronhightower/Software_Projects/juniper_web/.next/server/chunks/[root-of-the-server]__df9e0b5c._.js:85:19)\n' +
    '    at async AppRouteRouteModule.do (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:26:34112)\n' +
    '    at async AppRouteRouteModule.handle (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js:26:41338)\n' +
    '    at async doRender (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/server/base-server.js:1518:42)\n' +
    '    at async DevServer.renderToResponseWithComponentsImpl (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/server/base-server.js:1920:28)\n' +
    '    at async DevServer.renderPageComponent (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/server/base-server.js:2408:24)\n' +
    '    at async DevServer.renderToResponseImpl (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/server/base-server.js:2445:32)\n' +
    '    at async DevServer.pipeImpl (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/server/base-server.js:1008:25)\n' +
    '    at async NextNodeServer.handleCatchallRenderRequest (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/server/next-server.js:305:17)\n' +
    '    at async DevServer.handleRequestImpl (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/server/base-server.js:900:17)\n' +
    '    at async /Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/server/dev/next-dev-server.js:371:20\n' +
    '    at async Span.traceAsyncFn (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/trace/trace.js:157:20)\n' +
    '    at async DevServer.handleRequest (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/server/dev/next-dev-server.js:368:24)\n' +
    '    at async invokeRender (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/server/lib/router-server.js:237:21)\n' +
    '    at async handleRequest (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/server/lib/router-server.js:428:24)\n' +
    '    at async requestHandlerImpl (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/server/lib/router-server.js:452:13)\n' +
    '    at async Server.requestListener (/Users/cameronhightower/Software_Projects/juniper_web/node_modules/next/dist/server/lib/start-server.js:158:13)'
}
 POST /api/contact 500 in 284ms
