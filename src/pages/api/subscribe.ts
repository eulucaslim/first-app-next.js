import { stripe } from "@/services/stripe";
import { getSession } from "next-auth/react";
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/services/supabase";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const session =  await getSession({ req })
        
        const { data: user, error: userFoundError } = await supabase
        .from('users')
        .select('*')
        .eq('email', session?.user?.email)
        .single()

        userFoundError ? console.log(userFoundError) : null

        let costumerId = user.stripe_customer_id

        if (!costumerId) {
            const stripeCostumer = await stripe.customers.create({
                email: session?.user?.email!
            });
            
            const { error } = await supabase
            .from('users')
            .update({stripe_customer_id: stripeCostumer.id})
            .match({id: user.id, email: user.email})
            
            error ? console.log(error) : null
            costumerId = stripeCostumer.id
        }

        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: costumerId,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                {price: 'price_1Rh0gz4exLeG2KodtdtVmac3', quantity: 1}
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
        })

        return res.status(200).json({ sessionId: stripeCheckoutSession.id })

    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}