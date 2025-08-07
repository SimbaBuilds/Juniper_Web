import { NextResponse } from "next/server";
import { createSupabaseAppServerClient } from "@/lib/utils/supabase/server";

export async function GET() {
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

    // Get user profile with usage data
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        subscription_tier,
        subscription_status,
        subscription_current_period_end,
        requests_today,
        requests_week,
        requests_month,
        perplexity_usage_month,
        twitter_x_usage_month,
        textbelt_usage_month
      `)
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: "Failed to fetch usage data" },
        { status: 500 }
      );
    }

    // Define usage limits based on tier
    const limits = {
      free: {
        requests_monthly: 100,
        perplexity_monthly: 10,
        twitter_x_monthly: 5,
        textbelt_monthly: 3,
      },
      pro: {
        requests_monthly: 10000,
        perplexity_monthly: 1000,
        twitter_x_monthly: 500,
        textbelt_monthly: 200,
      }
    };

    const tierLimits = limits[profile.subscription_tier as keyof typeof limits];

    const usage = {
      tier: profile.subscription_tier,
      status: profile.subscription_status,
      period_end: profile.subscription_current_period_end,
      current: {
        requests_today: profile.requests_today,
        requests_week: profile.requests_week,
        requests_month: profile.requests_month,
        perplexity_usage_month: profile.perplexity_usage_month,
        twitter_x_usage_month: profile.twitter_x_usage_month,
        textbelt_usage_month: profile.textbelt_usage_month,
      },
      limits: tierLimits,
      percentages: {
        requests: Math.round((profile.requests_month / tierLimits.requests_monthly) * 100),
        perplexity: Math.round((profile.perplexity_usage_month / tierLimits.perplexity_monthly) * 100),
        twitter_x: Math.round((profile.twitter_x_usage_month / tierLimits.twitter_x_monthly) * 100),
        textbelt: Math.round((profile.textbelt_usage_month / tierLimits.textbelt_monthly) * 100),
      }
    };

    return NextResponse.json(usage);
  } catch (error) {
    console.error('Usage tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}