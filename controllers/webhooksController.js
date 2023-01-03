const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecretKey);
const nodemailer = require("nodemailer");
module.exports = {
    getEvents: async (req, res) => {

        const payload = req.body;
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_ENDPOINT_SECRETKEY;

        let event;

        try {
            event = stripe.webhooks.constructEvent(payload, sig.toString(), endpointSecret)
        } catch (err) {
            console.log(err.message)
            res.status(400).json({success: false})
            return;
        }

        console.log(event.type);
        console.log(event.data.object);
        console.log(event.data.object.id);
    },
    start: async (req, res) => {
        res.send("Welcome");
    },
    getEvent: async (req, res) => {
        const endpointSecret = "whsec_XYwueoi7ozW6fVlvmZUiKHiD4EMuuI18";
        const sig = req.headers['stripe-signature'];

        let event;
        let session = "";
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        // Handle the event
        switch (event.type) {
            case 'charge.expired':
                session = event.data.object;
                // Then define and call a function to handle the event charge.expired
                break;
            case 'charge.succeeded':
                session = event.data.object;
                // Then define and call a function to handle the event charge.succeeded
                break;
            case "checkout.session.async_payment_succeeded":
                session = event.data.object;

                // let emailTo = session.customer_details.email;
                let transporter = nodemailer.createTransport({
                    host: "zohomail.com",
                    service: "Zoho",
                    secureConnection: false,
                    auth: {
                        user: process.env.email,
                        pass: process.env.password
                    },
                });
                let info = await transporter.sendMail({
                    from: process.env.email,
                    to: "itay45977@gmail.com",
                    subject: "Thank you for your purchase",
                    text: "Hey, thank you for your purchase",
                    // html: `Hello ${session.customer_details.email} thanks for your purchase`,
                    html: 'Hello'
                });
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        res.status(200).send();
    }
}
