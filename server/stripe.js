const {createDonation} = require("./utils/donation");
const {updateVolunteerDonation} = require("./utils/volunteer");
const {updateDonations} = require("./utils/campaign");

const { STRIPE_SECRET_KEY, ENDPOINT_SECRET } = require('./config');
const stripe = require('stripe')(STRIPE_SECRET_KEY);
const YOUR_DOMAIN = 'http://localhost:8080/campaigns';
const router = require('express').Router();

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'fpx', 'grabpay'],
    line_items: [
      {
        price_data: {
          currency: 'myr',
          product_data: {
            name: req.body.name, 
            description: req.body.description
          },
          unit_amount: req.body.amount*100, 
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    metadata: {donor: req.body.newDonation.donor,
      annonymous:req.body.newDonation.annonymous,
      amount:req.body.newDonation.amount,
      method:req.body.newDonation.method,
      campaign:req.body.newDonation.campaign,
      name:req.body.newDonation.details.name, 
      username:req.body.newDonation.details.username, 
      image:req.body.newDonation.details.image, 
      message:req.body.newDonation.details.message
    },
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?cancel=false`,
  });
  res.json({ id: session.id });
});

const fulfillOrder = async (session) => {
  // TODO: fill me in
  console.log("Fulfilling order");
  let details;
  if(session.metadata.annonymous){
    details = {}
  } else {
    details = {
      name: session.metadata.name,
      username: session.metadata.username,
      message: session.metadata.message,
      image: session.metadata.image
    }
  }
  let req = {
    donor: session.metadata.donor,
    annonymous:session.metadata.annonymous,
    amount: session.metadata.amount,
    method:session.metadata.method,
    campaign: session.metadata.campaign,
  }
  await createDonation(req).then((res)=>{
    updateVolunteerDonation( session.metadata.donor, res._id).then((response) => {
      console.log('update volunteer', response)
    }).catch((err)=>{
      console.log('failed to update volunteer', err)
    })  
    updateDonations( session.metadata.campaign, res._id).then((response)=>{
      console.log('update campaign', response)
    }).catch((err)=>{
      console.log('failed to update campaign', err)
    })  
  }).catch((error)=> {
    console.log('error', error)
  })
}

const emailCustomerAboutFailedPayment = (session) => {
  // TODO: fill me in
  console.log("Emailing customer", session);
}

router.post('/webhook', (request, response) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(request.rawBody, request.headers['stripe-signature'], ENDPOINT_SECRET);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      if (session.payment_status === 'paid') {
        fulfillOrder(session);
      }
      break;
    }

    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object;
      // Fulfill the purchase...
      fulfillOrder(session);
      break;
    }

    case 'checkout.session.async_payment_failed': {
      const session = event.data.object;
      // Send an email to the customer asking them to retry their order
      emailCustomerAboutFailedPayment(session);
      break;
    }
  }

  response.status(200);
});

module.exports = router;