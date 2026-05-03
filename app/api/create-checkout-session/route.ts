import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

interface CheckoutRequest {
  resumeText: string;
  jobText: string;
  company?: string | null;
  role?: string | null;
}

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 500 });
  }
  if (!appUrl) {
    return NextResponse.json({ error: "NEXT_PUBLIC_APP_URL is not configured." }, { status: 500 });
  }

  let body: CheckoutRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.resumeText?.trim()) {
    return NextResponse.json({ error: "resumeText is required." }, { status: 400 });
  }
  if (!body.jobText?.trim()) {
    return NextResponse.json({ error: "jobText is required." }, { status: 400 });
  }

  const stripe = new Stripe(stripeKey);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Resume Optimization + Interview Prep",
              description:
                "Tailored resume rewrite, keyword optimization, and interview prep for this job",
            },
            unit_amount: 700,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: "Could not create checkout session. Please try again." },
      { status: 502 }
    );
  }
}
