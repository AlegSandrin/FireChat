import { useState,useEffect } from "react";

import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const auth = getAuth()

export default function SignInConfirm(){

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

    const navigate = useNavigate()
    

    useEffect(() => {
        const verifUsersDB = async () => {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await sleep(1000)
        const user = auth.currentUser;
    
        if(user){
        const db = getFirestore();
        const usersRef = doc(db, "usersDB", user.uid)
        const docs = await getDoc(usersRef)
        const data = docs.data()
        if(data){
           navigate('/')
        }}}

    verifUsersDB()
    },[])

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
                await setDoc(doc(db, 'usersDB', user.uid), {username: username, userID: userID})
                await navigate('/')
            }

    }

    return(
        
<div className="flex h-[100vh] w-[100vw] place-items-center">
    <div className='text-white rounded-3xl overflow-hidden drop-shadow-2xl shadow-inner mx-auto h-3/5 w-3/5'>
        <header className='color1 p-3'>
            <span className="flex text-3xl font-medium justify-center">Finalizando Cadastro</span>
        </header>
        <div className='flex flex-col color4 lg:p-20 lg:py-12 rounded-b-3xl'>

            <form className="flex flex-col" onSubmit={SubmitUser}>
                <div className="flex flex-col gap-2 mb-7">
                <span className="text-2xl">Nome de Usuário</span>
                <span className="text-xs opacity-80">(Nome que aparecerá para outros usuários)</span>
                <input className="outline-none rounded-xl p-3 text-black" value={username} placeholder="Nickname" id='username' onChange={(e) => setUsername(e.target.value)}></input>
                <p className={`font-bold md:mb-0 mb-5 text-xs ${username.length > 20 ? 'text-red-700' : 'text-white'}`}>{`${username.length}/20`}</p>
                </div>

                <div className="flex flex-col gap-2 mb-7">
                <span className="text-2xl">Seu ID de Usuário</span>
                <span className="text-xs opacity-80">(ID que utilizarão para adicionar-te aos contatos)</span>
                <input className="outline-none rounded-xl p-3 text-black" value={userID} placeholder="UserID" id='userID' onChange={(e) => setUserID(e.target.value)}></input>
                <p className={`font-bold md:mb-0 mb-5 text-xs ${userID.length > 20 ? 'text-red-700' : 'text-white'}`}>{`${userID.length}/20`}</p>
                </div>

                <button disabled={isDisabled} className={`rounded-xl p-4 color2 text-xl font-medium transition ${isDisabled ? 'saturate-0' : 'saturate-100 hover:brightness-125'}`} type="submit">Enviar</button>
            </form>
        </div>
    </div>
</div>
)
}


