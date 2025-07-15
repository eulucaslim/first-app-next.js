import { stripe } from "@/services/stripe"
import { supabase } from "@/services/supabase"

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false
) {
    const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single()

    const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId)

    if (createAction) {
        const { error: subscriptionError }  =  await supabase
        .from('subscriptions')
        .insert({
            subscription_id: subscriptionData.id,
            user_id: user.id,
            status: subscriptionData.status,
            price_id: subscriptionData.items.data[0].price.id
        })

        subscriptionError ? console.log("Error to insert item: " + subscriptionError.message) : console.log('Sucess to save subscription!') 
    } else {
        const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .update({
            subscription_id: subscriptionData.id,
            user_id: user.id,
            status: subscriptionData.status,
            price_id: subscriptionData.items.data[0].price.id
        })
        .eq('subscription_id', subscriptionId)

        subscriptionError ? console.log("Error to update or delete item: " + subscriptionError.message) : console.log('Sucess to update or delete subscription!') 
    }


}