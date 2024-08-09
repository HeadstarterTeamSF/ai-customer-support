import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
import { db, auth } from "@/firebaseConfig";
import { getDocs, doc, query, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { getAuth, signInWithCredential, GoogleAuthProvider } from "firebase/auth";

const handler = NextAuth({
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        // CredentialsProvider({
        //     name: 'Email and Password',
        //     credentials: {
        //         email: { label: "Email", type: "email" },
        //         password: { label: "Password", type: "password" }
        //     },
        //     async authorize(credentials) {
        //         try {
        //             if (!credentials || !credentials.email || !credentials.password) {
        //                 return null;
        //             }
        //             // find user or create user based on firebase users collection
        //             const userdb = await getDoc(doc(usersRef, credentials.email.toLowerCase()));
        //             if (!userdb.exists()) {
        //                 const response = await createUserWithEmailAndPassword(auth, email, password);
        //                 await setDoc(doc(usersRef, response.user.uid), {
        //                     email: credentials.email,
        //                     firstName: credentials.email.split()[0],
        //                     lastName: credentials.email.split()[1],
        //                     userId: response.user.uid
        //                 })
        //                 return response.user;
        //             } else {
        //                 const response = await signInWithEmailAndPassword(auth, email, password);
        //                 return response.user;
        //             }
        //         } catch (e) {
        //             let msg = e.message
        //             if (msg.includes('(auth/invalid-email)')) msg = "Invalid Email"
        //             if (msg.includes('(auth/email-already-in-use)')) msg = "This email is already in use."
        //             return { success: false, msg }

        //         }
        //     }
        // }),
        // ...add more providers here
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            const credential = GoogleAuthProvider.credential(account.id_token);

            try {
                const firebaseUser = await signInWithCredential(auth, credential);

                // If the Firebase user doesn't exist, it will be created here.
                // You can also sync additional data with Firebase here.
                // Store user data in Firestore
                const userDoc = doc(db, "users", firebaseUser.user.uid);

                await setDoc(userDoc, {
                    uid: firebaseUser.user.uid,
                    name: firebaseUser.user.displayName || profile.name,
                    email: firebaseUser.user.email || profile.email,
                    profilePicture: firebaseUser.user.photoURL || profile.picture,
                    lastLogin: new Date().toISOString()
                }, { merge: true });

                return true;
            } catch (error) {
                console.error('Firebase sign-in error:', error);
                return false;
            }
        },
        async session({ session, token, user }) {
            // Optionally, pass Firebase UID or other data to the session object
            session.user.uid = user?.uid;
            return session;
        },
    }
})

export { handler as GET, handler as POST }