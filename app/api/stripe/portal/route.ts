import { NextResponse } from "next/server";
import { stripe, getURL } from "@/lib/stripe";
import { createSupabaseAppServerClient } from "@/lib/utils/supabase/server";

export async function POST() {
  try {
    const supabase = await createSupabaseAppServerClient();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user profile with Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No billing information found" },
        { status: 404 }
      );
    }

    // Create a portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${getURL()}account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Portal session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}