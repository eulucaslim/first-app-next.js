import { signIn, useSession } from "next-auth/react";
import styles from "./styles.module.scss";
import { api } from "@/services/api";
import { getStripeJs } from "@/services/stripe-js";

interface SubscribeButtonProps {
    priceId: string
}
export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data: session } = useSession();

    async function handleSubscribe(){
        if (!session) {
            signIn('github')
            return;
        }

        try {
            const response = await api.post('/subscribe')
            const { sessionId } = response.data;
            const stripe = await getStripeJs();

            await stripe?.redirectToCheckout({sessionId})
        } catch (err) {
            alert(err)
        }
    }

    return (
        <button 
            type="button" 
            className={styles.subscribeButton}
            onClick={handleSubscribe}
        >
            Subscribe now
        </button>
    );
}