{
  "id": "evt_1RttJHP3MuCplnDXyVZOS5zX",
  "object": "event",
  "api_version": "2024-12-18.acacia",
  "created": 1754671106,
  "data": {
    "object": {
      "id": "sub_1RttJGP3MuCplnDX4v15oIUb",
      "object": "subscription",
      "application": null,
      "application_fee_percent": null,
      "automatic_tax": {
        "disabled_reason": null,
        "enabled": false,
        "liability": null
      },
      "billing_cycle_anchor": 1754671104,
      "billing_cycle_anchor_config": null,
      "billing_mode": {
        "type": "classic"
      },
      "billing_thresholds": null,
      "cancel_at": null,
      "cancel_at_period_end": false,
      "canceled_at": null,
      "cancellation_details": {
        "comment": null,
        "feedback": null,
        "reason": null
      },
      "collection_method": "charge_automatically",
      "created": 1754671104,
      "currency": "usd",
      "current_period_end": 1757349504,
      "current_period_start": 1754671104,
      "customer": "cus_SpYPQTgBRUZksw",
      "days_until_due": null,
      "default_payment_method": "pm_1RttJDP3MuCplnDXDdi0xjgu",
      "default_source": null,
      "default_tax_rates": [],
      "description": null,
      "discount": null,
      "discounts": [],
      "ended_at": null,
      "invoice_settings": {
        "account_tax_ids": null,
        "issuer": {
          "type": "self"
        }
      },
      "items": {
        "object": "list",
        "data": [
          {
            "id": "si_SpYQLYhRADrtRJ",
            "object": "subscription_item",
            "billing_thresholds": null,
            "created": 1754671104,
            "current_period_end": 1757349504,
            "current_period_start": 1754671104,
            "discounts": [],
            "metadata": {},
            "plan": {
              "id": "price_1RtqOIP3MuCplnDXG0qTT6gI",
              "object": "plan",
              "active": true,
              "aggregate_usage": null,
              "amount": 2999,
              "amount_decimal": "2999",
              "billing_scheme": "per_unit",
              "created": 1754659886,
              "currency": "usd",
              "interval": "month",
              "interval_count": 1,
              "livemode": true,
              "metadata": {},
              "meter": null,
              "nickname": null,
              "product": "prod_SpVPmyut6ptlYP",
              "tiers_mode": null,
              "transform_usage": null,
              "trial_period_days": null,
              "usage_type": "licensed"
            },
            "price": {
              "id": "price_1RtqOIP3MuCplnDXG0qTT6gI",
              "object": "price",
              "active": true,
              "billing_scheme": "per_unit",
              "created": 1754659886,
              "currency": "usd",
              "custom_unit_amount": null,
              "livemode": true,
              "lookup_key": null,
              "metadata": {},
              "nickname": null,
              "product": "prod_SpVPmyut6ptlYP",
              "recurring": {
                "aggregate_usage": null,
                "interval": "month",
                "interval_count": 1,
                "meter": null,
                "trial_period_days": null,
                "usage_type": "licensed"
              },
              "tax_behavior": "exclusive",
              "tiers_mode": null,
              "transform_quantity": null,
              "type": "recurring",
              "unit_amount": 2999,
              "unit_amount_decimal": "2999"
            },
            "quantity": 1,
            "subscription": "sub_1RttJGP3MuCplnDX4v15oIUb",
            "tax_rates": []
          }
        ],
        "has_more": false,
        "total_count": 1,
        "url": "/v1/subscription_items?subscription=sub_1RttJGP3MuCplnDX4v15oIUb"
      },
      "latest_invoice": "in_1RttJEP3MuCplnDXWCAszuux",
      "livemode": true,
      "metadata": {},
      "next_pending_invoice_item_invoice": null,
      "on_behalf_of": null,
      "pause_collection": null,
      "payment_settings": {
        "payment_method_options": {
          "acss_debit": null,
          "bancontact": null,
          "card": {
            "network": null,
            "request_three_d_secure": "automatic"
          },
          "customer_balance": null,
          "konbini": null,
          "sepa_debit": null,
          "us_bank_account": null
        },
        "payment_method_types": [
          "card"
        ],
        "save_default_payment_method": "off"
      },
      "pending_invoice_item_interval": null,
      "pending_setup_intent": null,
      "pending_update": null,
      "plan": {
        "id": "price_1RtqOIP3MuCplnDXG0qTT6gI",
        "object": "plan",
        "active": true,
        "aggregate_usage": null,
        "amount": 2999,
        "amount_decimal": "2999",
        "billing_scheme": "per_unit",
        "created": 1754659886,
        "currency": "usd",
        "interval": "month",
        "interval_count": 1,
        "livemode": true,
        "metadata": {},
        "meter": null,
        "nickname": null,
        "product": "prod_SpVPmyut6ptlYP",
        "tiers_mode": null,
        "transform_usage": null,
        "trial_period_days": null,
        "usage_type": "licensed"
      },
      "quantity": 1,
      "schedule": null,
      "start_date": 1754671104,
      "status": "active",
      "test_clock": null,
      "transfer_data": null,
      "trial_end": null,
      "trial_settings": {
        "end_behavior": {
          "missing_payment_method": "create_invoice"
        }
      },
      "trial_start": null
    }
  },
  "livemode": true,
  "pending_webhooks": 1,
  "request": {
    "id": null,
    "idempotency_key": "b3d74e06-c780-4031-8cc9-a049d49e7755"
  },
  "type": "customer.subscription.created"
}