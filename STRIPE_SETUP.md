# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payments for the Juniper web application with Free and Pro tiers.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. NextJS 15 application (already set up)
3. Supabase database (already configured)

## 1. Stripe Dashboard Configuration

### Step 1: Get API Keys
1. Log into your Stripe Dashboard
2. Go to **Developers > API Keys**
3. Copy your **Publishable key** and **Secret key**
4. Update `.env.local` with your actual keys:

```bash
# Replace with your actual Stripe keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Step 2: Create Products and Prices
1. Go to **Products** in your Stripe Dashboard
2. Click **+ Add product**
3. Create a "Juniper Pro" product:
   - **Name**: Juniper Pro
   - **Description**: Premium AI assistant features with higher usage limits
   - **Pricing**: Recurring, $29.00 USD monthly
4. Copy the **Price ID** (starts with `price_`) and update `.env.local`:

```bash
STRIPE_PRO_PRICE_ID=price_your_actual_price_id_here
```

### Step 3: Configure Webhooks
1. Go to **Developers > Webhooks**
2. Click **+ Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
   - For local testing: `https://your-ngrok-url.ngrok.io/api/stripe/webhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook signing secret** and update `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Step 4: Configure Customer Portal
1. Go to **Settings > Billing > Customer portal**
2. Enable the customer portal
3. Configure allowed actions:
   - ✅ Update payment methods
   - ✅ View invoices
   - ✅ Cancel subscriptions
   - ✅ Update billing information

## 2. Database Schema Updates

The following fields have been added to the `user_profiles` table:

```sql
-- Add these columns to your user_profiles table
ALTER TABLE user_profiles ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE user_profiles ADD COLUMN stripe_subscription_id TEXT;
ALTER TABLE user_profiles ADD COLUMN subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing', 'unpaid', 'incomplete', 'incomplete_expired'));
ALTER TABLE user_profiles ADD COLUMN subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro'));
ALTER TABLE user_profiles ADD COLUMN subscription_current_period_end TIMESTAMPTZ;
ALTER TABLE user_profiles ADD COLUMN subscription_cancel_at_period_end BOOLEAN DEFAULT false;
```

## 3. Testing the Integration

### Local Testing with ngrok
1. Install ngrok: `npm install -g ngrok`
2. Start your Next.js app: `npm run dev`
3. In another terminal: `ngrok http 3000`
4. Use the ngrok HTTPS URL for webhook configuration

### Test Scenarios

#### Test Pro Subscription
1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date and any CVC
3. Go to `/account` and click "Upgrade to Pro"
4. Complete checkout process
5. Verify webhook processes correctly

#### Test Subscription Management
1. After subscribing, click "Manage Billing"
2. Test canceling subscription
3. Verify webhook updates database correctly

## 4. Usage Limits Configuration

The system includes these usage limits:

### Free Tier
- 100 requests per month
- 10 Perplexity searches
- 5 Twitter/X interactions  
- 3 SMS messages

### Pro Tier
- 10,000 requests per month
- 1,000 Perplexity searches
- 500 Twitter/X interactions
- 200 SMS messages

These limits are configured in `/api/stripe/usage/route.ts` and can be adjusted as needed.

## 5. API Endpoints Created

- **POST** `/api/stripe/checkout` - Create checkout session
- **POST** `/api/stripe/portal` - Create customer portal session
- **POST** `/api/stripe/webhook` - Handle Stripe webhooks
- **GET** `/api/stripe/usage` - Get user usage data

## 6. Security Considerations

1. **Never expose secret keys** - Keep them server-side only
2. **Webhook verification** - All webhooks are verified using signature
3. **User authentication** - All endpoints check for authenticated users
4. **Environment variables** - All sensitive data is stored in env vars

## 7. Production Deployment

1. Replace test keys with live keys in production environment
2. Update webhook endpoint URL to production domain
3. Test thoroughly with real payment methods
4. Monitor webhook deliveries in Stripe Dashboard

## 8. Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check webhook URL is accessible
   - Verify webhook secret matches
   - Check webhook event selection

2. **Checkout session not working**
   - Verify STRIPE_PRO_PRICE_ID is correct
   - Check Stripe keys are valid
   - Ensure user is authenticated

3. **Database not updating**
   - Check webhook signature verification
   - Verify Supabase service role key permissions
   - Review webhook event handling logic

### Debug Mode
Enable debug logging by adding to `.env.local`:
```bash
NODE_ENV=development
```

## 9. Support and Documentation

- [Stripe Documentation](https://docs.stripe.com/)
- [Stripe NextJS Guide](https://stripe.com/docs/payments/checkout/custom-success-page)
- [Webhook Testing](https://stripe.com/docs/webhooks/test)

## Implementation Summary

✅ **Completed Features:**
- Free and Pro tier subscription system
- Secure checkout process with Stripe Checkout
- Customer portal for self-service billing
- Real-time webhook processing
- Usage tracking and limits
- Account page integration with subscription management
- Responsive pricing components

The implementation follows Stripe and NextJS best practices with proper security measures and error handling.