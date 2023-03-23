import { useState,useEffect } from "react";

import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { auth } from "../services/firebaseService";
import { useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import { useAuthState } from "react-firebase-hooks/auth";


export default function SignInConfirm({SignInConfirm}){

    const [user] = useAuthState(auth)

    const navigate = useNavigate()

    useEffect(() =>{
        if(!SignInConfirm){
           if(user){
            navigate('/')
           }
           else{
            <SignIn/>
           } 
        }
    })

    const [username, setUsername] = useState('')
    const [userID, setUserID] = useState('')
    const [isDisabled, setIsDisabled] = useState(false)

    useEffect(() => {
        if(username.length > 20 || username.length < 4
        || userID.length > 20 || userID.length < 6){
            setIsDisabled(true)
        }
        else{
            setIsDisabled(false)
        }
    },[username, userID])

    const SubmitUser = async (e) =>{
            e.preventDefault();

            const user = auth.currentUser;
            const db = getFirestore();
            const usersRef = collection(db, "usersDB")
            const UsersIDQuery = query(usersRef, where('userID', '==', userID))
            const docs = await getDocs(UsersIDQuery)
            if(!docs.empty){
                alert("ID de Usuário já em uso!")
            }
            else{
                await setDoc(doc(db, 'usersDB', user.uid), 
                {username: username,
                 userID: userID,
                 email: user.email,
                 photoURL: user.photoURL
                 }).then(() => {
                    document.location.reload()
                 })
                
            }

    }

    return (
      <div className="SignInConfirm flex h-screen place-items-center">
        <div className="m-auto h-[85%] w-[95%] overflow-hidden rounded-3xl text-white shadow-inner drop-shadow-2xl md:h-[600px] md:w-[600px]">
          <header className="color1 p-3">
            <span className="flex justify-center text-2xl font-medium md:text-3xl">
              Finalizando Cadastro
            </span>
          </header>
          <div className="color4 flex flex-col rounded-b-3xl p-5 py-12 md:p-20">
            <form className="flex flex-col" onSubmit={SubmitUser}>
              <div className="mb-7 flex flex-col gap-2">
                <span className="text-xl md:text-2xl">Nome de Usuário</span>
                <span className="text-xs opacity-80">
                  (Nome que aparecerá para outros usuários)
                </span>
                <input
                  className="rounded-xl p-3 text-black outline-none"
                  value={username}
                  placeholder="Nickname"
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                ></input>
                <p
                  className={`mb-5 text-xs font-bold md:mb-0 ${
                    username.length > 20 ? "text-red-700" : "text-white"
                  }`}
                >{`${username.length}/20`}</p>
              </div>

              <div className="mb-4 flex flex-col gap-2 md:mb-7">
                <span className="text-xl md:text-2xl">Seu ID de Usuário</span>
                <span className="text-xs opacity-80">
                  (ID que utilizarão para adicionar-te aos contatos)
                </span>
                <input
                  className="rounded-xl p-3 text-black outline-none"
                  value={userID}
                  placeholder="UserID"
                  id="userID"
                  onChange={(e) => setUserID(e.target.value)}
                ></input>
                <p
                  className={`mb-5 text-xs font-bold md:mb-0 ${
                    userID.length > 20 ? "text-red-700" : "text-white"
                  }`}
                >{`${userID.length}/20`}</p>
              </div>

              <button
                disabled={isDisabled}
                className={`color2 rounded-xl p-3 text-lg font-medium transition md:p-4 md:text-xl ${
                  isDisabled
                    ? "saturate-0"
                    : "saturate-100 hover:brightness-125"
                }`}
                type="submit"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    );
}


