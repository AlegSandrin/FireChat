import { IoLogoGoogle } from "react-icons/io";
import logo from "../assets/img/logo.png"
import { auth, provider } from "../services/firebaseService";

export default function SignIn(){

        const SignInWithGoogle = () => {
            auth.signInWithPopup(provider)
        }
    
        return (


<div className="SignIn grid h-screen place-items-center">
    <div className='text-white rounded-3xl overflow-hidden drop-shadow-2xl shadow-inner md:h-auto md:w-[600px] h-auto w-[95%]'>
        <div className='flex flex-col items-center bg-[#33384e] bg-opacity-75 md:px-20 px-5 pb-14 rounded-b-3xl'>

        <img src={logo} className='h-auto w-[75%] mx-auto brightness-110 translate-y-10 saturate-150'></img>

        <label className="md:text-3xl text-xl mb-2">Seja bem-vindo ao</label>
        <label className="md:text-5xl text-3xl">FireChat</label>
        <label className="text-[0.5rem] mt-1 opacity-40">Firebase + Chat :P</label>

        <label className="mt-10">Faça login para continuar</label>

        <button
        className="bg-gradient-to-r from-[#992c4b] to-[#a13c81] transition hover:brightness-125 text-black flex w-full items-center shadow-2xl mt-4 rounded-lg" 
        onClick={SignInWithGoogle}
        >
        <IoLogoGoogle className='text-white text-[3rem] m-2'/>
        <label className="mx-auto cursor-pointer font-semibold text-lg text-white">Sign in with Google</label>
        </button>

        </div>
    </div>
</div>

        )
}