import { useState, useRef, useEffect } from 'react'

import firebase from 'firebase/compat/app'

import { doc, getDoc, getFirestore } from 'firebase/firestore'

import { useAuthState } from 'react-firebase-hooks/auth'

import { FaSignOutAlt } from 'react-icons/fa'
import { MdContactMail } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import PublicChat from './PublicChat'
import Loading from './Loading'
import Sidebar from './Sidebar'
import { db, auth, provider } from '../services/firebaseService'
import SignIn from '../pages/SignIn'

export default function Chat() {

    const [data, setData] = useState()
    const [user, loading] = useAuthState(auth)
    const [userChat, setUserChat] = useState(null)

    useEffect(() => {
        return data
    },[data])

    const UserData = (DataUser) => {
        setData(DataUser)
    }

    if(loading) return <Loading/>

    return(
        <div className='text-white md:rounded-3xl grid grid-cols-12 grid-rows-8 lg:h-full lg:w-full md:h-[90%] md:w-[95%] h-full w-full m-auto overflow-hidden drop-shadow-2xl shadow-inner'>
            <header className='row-span-1 col-span-3 p-4 color2 overflow-hidden'>
                <SignOut/>
            </header>
            <div className='col-span-3 row-start-2 row-end-7 overflow-y-auto color1'>
                <Sidebar setUserChat={setUserChat} userChat={userChat} UserData={data}/>
            </div>
            <section className='inline-flex col-span-9 row-span-6 col-start-4 overflow-hidden color4 pt-4'>
                {user ? <ChatRoom UserData={UserData}/> : <SignIn/>}
            </section>
        </div>
    )
}

function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>
            <div className='flex gap-1 text-xl'>
            <FaSignOutAlt/>
            <span className='text-base'>Sair</span>
            </div>
            </button>
    )
}



function ChatRoom({UserData}) {

    const navigate = useNavigate()
    const [data, setData] = useState()

    useEffect(() => {
        const verifUsersDB = async () => {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await sleep(1000)
        const user = auth.currentUser;
    
        if(user){
        const usersRef = doc(db, "usersDB", user.uid)
        const docs = await getDoc(usersRef)
        const dataUser = docs.data()
        setData(dataUser)
        if(dataUser == null || undefined){
            navigate('confirm')
        }
        UserData(dataUser)
}}

    verifUsersDB()
    },[])

    return(
        <PublicChat
        data={data}
        />
    )

}

export function ChatMessage(props) {

    const { text, uid, photoURL, createdAt, username } = props.message;
    const ts_ms = new Date(createdAt * 1000); // timestamp para milisegundos
    var date = new Date(ts_ms); // inicia um novo objeto Date
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // mes
    var day = ("0" + (date.getDate() + 1)).slice(-2); // dia
    var hours = ("0" + date.getHours()).slice(-2); // horas
    var minutes = ("0" + date.getMinutes()).slice(-2); // minutos

    const photo = photoURL;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
    <div className={`div${messageClass} ml-2`}>
            
        <div className={`${messageClass} inline-flex m-5 rounded-xl brightness-125 py-1 px-2`}>
            <img className='h-[35px] rounded-full mr-2 w-auto -translate-y-6 -translate-x-6' src={photo}/>
            <div>
                <div className='flex font-thin text-[0.5rem] h-auto w-auto'>
                    <span className='text-base font-normal float-left -translate-x-8 m-1'>{username}</span>
                    <span className='float-right my-auto ml-auto'> {day}/{month} {hours}:{minutes}</span>
                </div>
            <p className='m-2 font-extralight text-sm -translate-x-9 mt-0'>{text}</p>
            </div>
        </div>
    </div>
    )
    
}