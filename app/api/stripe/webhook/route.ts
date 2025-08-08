/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from "@/lib/stripe";
import { createSupabaseServiceClient } from "@/lib/utils/supabase/service";
import Stripe from "stripe";

// Route Segment Config
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 59;

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
]);

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = headers().get('stripe-signature');

    // Debug logging
    console.log('Webhook Secret:', process.env.STRIPE_WEBHOOK_SECRET?.slice(0, 5) + '...');
    console.log('Raw Body Length:', rawBody.length);
    console.log('Raw Body Type:', typeof rawBody);
    console.log('First 100 chars of Raw Body:', rawBody.slice(0, 100));

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing signature or webhook secret');
      return new NextResponse('Webhook signature or secret missing', { status: 400 });
    }

    try {
      const event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      
      console.log('Event successfully constructed:', event.type);

      if (!relevantEvents.has(event.type)) {
        return NextResponse.json({ received: true });
      }

      const supabase = createSupabaseServiceClient();

      switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        
        if (!userId || !session.subscription) {
          console.error('No user ID or subscription in checkout session metadata');
          break;
        }

        // Store subscription details immediately since checkout completed successfully
        await supabase
          .from('user_profiles')
          .update({
            stripe_subscription_id: session.subscription as string,
            subscription_tier: 'pro',
            subscription_status: 'active',
            stripe_customer_id: session.customer as string,
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
    } catch (verifyError) {
      console.error('Verification Error Details:', {
        signatureHeader: signature?.slice(0, 50),
        bodyPreview: rawBody.slice(0, 50) + '...'
      });
      throw verifyError;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message.slice(0, 50),
        name: error.name.slice(0, 50),
        stack: error.stack?.slice(0, 50),
      });
    }
    return new NextResponse(
      error instanceof Error ? error.message.slice(0, 50) : 'Webhook handler failed',
      { status: 400 }
    );
  }
}

