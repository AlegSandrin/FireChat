import { useState, useRef, useEffect } from 'react'

import { doc, getDoc, getFirestore } from 'firebase/firestore'

import { useAuthState } from 'react-firebase-hooks/auth'

import { useNavigate } from 'react-router-dom'

import PublicChat from './PublicChat'
import Loading from './Loading'
import Sidebar from './Sidebar'
import { db, auth } from '../services/firebaseService'
import ChatHeader from './ChatHeader'
import SignOut from './SignOut'
import PrivateChat from './PrivateChat'
import { ChatRoom } from './ChatRoom'

export default function Chat() {

    const [data, setData] = useState()
    const [user] = useAuthState(auth)
    const [userChat, setUserChat] = useState(null)

    const UserData = (DataUser) => {
        setData(DataUser)
    }

    return(
        <div className='text-white md:rounded-3xl grid grid-cols-12 grid-rows-6 lg:h-full lg:w-full lg:m-auto md:h-[90%] md:w-[95%] h-[100vh] w-[100vw] overflow-hidden drop-shadow-2xl shadow-inner'>
            <header className='row-span-1 col-span-3 p-4 color2 overflow-hidden drop-shadow-xl '>
                <SignOut/>
            </header>
            <div className='col-span-3 row-start-2 row-end-7 overflow-y-auto color3 drop-shadow-xl h-full'>
                {data ? <Sidebar setUserChat={setUserChat} userChat={userChat} UserData={data}/> : <Loading/>}
            </div>
            <section className='inline-flex flex-col col-span-9 row-span-6 col-start-4 overflow-hidden color4'>
                {userChat ? <ChatHeader userChat={userChat}/> : <div className='m-2'></div>}
                {!user ? <Loading/> :  <ChatRoom UserData={UserData} userChat={userChat}/>}
            </section>
        </div>
    )
}

export function ChatMessage(props) {
    const CurrentUserID = props.CurrentUserID
    const { text, uid, photoURL, createdAt, username, userID } = props.message;
    const ts_ms = new Date(createdAt * 1000); // timestamp para milisegundos
    var date = new Date(ts_ms); // inicia um novo objeto Date
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // mes
    var day = ("0" + (date.getDate() + 1)).slice(-2); // dia
    var hours = ("0" + date.getHours()).slice(-2); // horas
    var minutes = ("0" + date.getMinutes()).slice(-2); // minutos

    const photo = photoURL;
    const messageClass = uid === auth.currentUser.uid || userID === CurrentUserID  ? 'sent' : 'received' ;

    return (
    <div className={`div${messageClass} ml-2`}>
            
        <div className={`${messageClass} inline-flex m-5 rounded-xl brightness-125 py-1 px-2`}>

            <img className='h-[35px] rounded-full mr-2 w-auto -translate-y-6 -translate-x-6' src={photo} referrerPolicy="no-referrer"/>
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