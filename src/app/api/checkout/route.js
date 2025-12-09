// app/api/checkout/route.js
import { Stripe } from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  const { price } = await req.json()
  const amount = Number(price)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'intelQA™ Harmony Intelligence Report™' },
        unit_amount: amount * 100,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}`,
    metadata: { type: 'harmony_report', amount }
  })

  return Response.json({ url: session.url })
}