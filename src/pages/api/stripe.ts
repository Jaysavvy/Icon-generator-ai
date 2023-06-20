import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe"
import { env } from "~/env.mjs";
import {buffer} from "micro"

const stripe = new Stripe(env.STRIPE_SECRET_KEY{
  apiVersion: '2022-11-15',
})

const webhook = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST'){
    const buf = await buffer
    const sig = req.headers['stripe-signature'] as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body, 
      sig, 
      env.STRIPE_WEB_HOOK_SECRET);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  console.log(`Unhandled event type ${event.type}`);

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.listen(4242, () => console.log('Running on port 4242'));

  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end("Method Not Allowed")
  }

}

export default webhook;







  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  console.log(`Unhandled event type ${event.type}`);

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.listen(4242, () => console.log('Running on port 4242'));