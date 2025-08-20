 ⨯ ./app/api/integrations/route.ts:2:1
Export createClient doesn't exist in target module
  1 | import { NextRequest, NextResponse } from 'next/server';
> 2 | import { createClient } from '@/lib/utils/supabase/server';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  3 | import { IntegrationService } from '@/app/lib/integrations/IntegrationService';
  4 |
  5 | export async function GET(request: NextRequest) {

The export createClient was not found in module [project]/lib/utils/supabase/server.ts [app-route] (ecmascript).
Did you mean to import createSupabaseAppServerClient?
All exports of the module are statically known (It doesn't have dynamic exports). So it's known statically that the requested export doesn't exist.


 ✓ Compiled /_error in 396ms
 GET /api/integrations 500 in 728ms
