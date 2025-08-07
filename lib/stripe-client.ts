'use client'

import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe promise
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

// Get publishable key for client components
export const getStripePublishableKey = () => {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
};