import Loading from "../components/Loading";
import { auth, provider } from "../services/firebaseService";

export default function SignIn(){

        const SignInWithGoogle = () => {
            auth.signInWithPopup(provider)
        }
    
        return (
            <button onClick={SignInWithGoogle}>Sign in with Google</button>
        )
}