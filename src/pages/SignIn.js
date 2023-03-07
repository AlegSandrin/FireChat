import { useNavigate } from "react-router-dom";
import { auth, provider } from "../services/firebaseService";

export default function SignIn(){

        const navigate = useNavigate()
    
        const SignInWithGoogle = () => {
            auth.signInWithPopup(provider).then(() => {
              navigate('/confirm')  
            });
            
        }
    
        return (
            <button onClick={SignInWithGoogle}>Sign in with Google</button>
        )
}