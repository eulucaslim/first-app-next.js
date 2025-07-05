import '../styles/global.scss';
import { AppProps } from "next/app";
import { Header } from "@/components/Header";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: {session, ...pageProps}, }: AppProps) {
    return (
        <>
          <SessionProvider session={session} refetchInterval={5 * 60}>
            <Header/>
            <Component {...pageProps}/>
          </SessionProvider>
        </>
    )
}

export default MyApp