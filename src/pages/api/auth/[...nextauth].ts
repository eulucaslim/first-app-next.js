import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { supabase } from '../../../services/supabase';
import { PostgrestError } from "@supabase/supabase-js";


export default NextAuth({
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        authorization: {
            params: {
                scope: "read:user", 
            },
        }
      }),
    ],
    callbacks: {
      async signIn({ user, account, profile}) {
        const { email } = user
        try {
          const { data, error } = await supabase
            .from('users')
            .select()
          
          const userEmail = data?.find(user => user.email == email)
          
          if (!userEmail) {
            await supabase.from('users').insert({email: email})
            return true
          }
          else {
            return true
          }
          
        } catch (error){
          console.log(error)
          return false
        }
          
      }
    }
})