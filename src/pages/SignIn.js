import { IoLogoGoogle } from "react-icons/io";
import logo from "../assets/img/logo.png"
import { auth, provider } from "../services/firebaseService";

export default function SignIn(){

        const SignInWithGoogle = () => {
            auth.signInWithPopup(provider)
        }
    
        return (
          <div className="SignIn grid h-screen place-items-center">
            <div className="h-auto w-[95%] overflow-hidden rounded-3xl text-white shadow-inner drop-shadow-2xl md:w-[600px]">
              <div className="flex flex-col items-center rounded-b-3xl bg-[#33384e] bg-opacity-75 px-5 pb-14 md:px-20">
                <img
                  src={logo}
                  alt="FireChat Logo"
                  className="mx-auto h-auto w-[75%] translate-y-10 brightness-110 saturate-150"
                  referrerPolicy="no-referrer"
                ></img>

                <label className="mb-2 text-xl md:text-3xl">
                  Seja bem-vindo ao
                </label>
                <label className="text-3xl md:text-5xl">FireChat</label>
                <label className="mt-1 text-[0.5rem] opacity-40">
                  Firebase + Chat :P
                </label>

                <label className="mt-10">Faça login para continuar</label>

                <button
                  className="mt-4 flex w-full items-center rounded-lg bg-gradient-to-r from-[#992c4b] to-[#a13c81] text-black shadow-2xl transition hover:brightness-125"
                  onClick={SignInWithGoogle}
                >
                  <IoLogoGoogle className="m-2 text-[3rem] text-white" />
                  <label className="mx-auto cursor-pointer text-lg font-semibold text-white">
                    Sign in with Google
                  </label>
                </button>
              </div>
            </div>
          </div>
        );
}