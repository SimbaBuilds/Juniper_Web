/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSupabaseServiceClient } from "@/lib/utils/supabase/service";
import Stripe from "stripe";

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
]);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing webhook signature or secret' },
        { status: 400 }
      );
    }
    
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true });
  }

  const supabase = createSupabaseServiceClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        
        if (!userId || !session.subscription) {
          console.error('No user ID or subscription in checkout session metadata');
          break;
        }

        // Just store the subscription ID for now - details will be handled by subscription events
        await supabase
          .from('user_profiles')
          .update({
            stripe_subscription_id: session.subscription as string,
            subscription_tier: 'pro',
          })
          .eq('id', userId);

        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get user by stripe customer ID
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          await supabase
            .from('user_profiles')
            .update({
              stripe_subscription_id: subscription.id,
              subscription_status: subscription.status,
              subscription_tier: subscription.status === 'active' ? 'pro' : 'free',
              subscription_current_period_end: new Date(((subscription as any).current_period_end) * 1000),
              subscription_cancel_at_period_end: (subscription as any).cancel_at_period_end,
            })
            .eq('id', profile.id);
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Get user by stripe customer ID
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          await supabase
            .from('user_profiles')
            .update({
              subscription_status: 'canceled',
              subscription_tier: 'free',
              subscription_cancel_at_period_end: false,
            })
            .eq('id', profile.id);
        }

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription;
        
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customerId = subscription.customer as string;

          // Get user by stripe customer ID
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single();

          if (profile) {
            await supabase
              .from('user_profiles')
              .update({
                subscription_status: 'active',
                subscription_tier: 'pro',
                subscription_current_period_end: new Date(((subscription as any).current_period_end) * 1000),
              })
              .eq('id', profile.id);
          }
        }

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as any).subscription;
        
        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customerId = subscription.customer as string;

          // Get user by stripe customer ID
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('stripe_customer_id', customerId)
            .single();

          if (profile) {
            await supabase
              .from('user_profiles')
              .update({
                subscription_status: subscription.status,
              })
              .eq('id', profile.id);
          }
        }

        break;
      }

      default:
        console.log(`Unhandled relevant event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}