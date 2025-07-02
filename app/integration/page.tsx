import { redirect } from 'next/navigation';

// This page is a server component that immediately redirects to the Supabase Edge Function,
// preserving all query parameters from the incoming request.

export default async function IntegrationRedirectPage({ 
  searchParams 
}: { 
  searchParams: Promise<Record<string, string | string[]>> 
}) {
  const params = await searchParams;
  
  // Get Supabase URL from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is not set');
  }
  
  // Build the edge function URL
  const edgeFunctionUrl = `${supabaseUrl}/functions/v1/handle-integration-form`;
  
  // Build the query string from searchParams
  const query = new URLSearchParams();
  for (const key in params) {
    const value = params[key];
    if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, v));
    } else if (value !== undefined) {
      query.append(key, value);
    }
  }
  
  const dest = `${edgeFunctionUrl}${query.toString() ? `?${query.toString()}` : ''}`;
  redirect(dest); // 307 Temporary Redirect by default
  return null;
} 