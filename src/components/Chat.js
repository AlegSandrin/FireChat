import { useState, useEffect } from 'react'

import { FaBars, FaTimes } from 'react-icons/fa'

import { useAuthState } from 'react-firebase-hooks/auth'
import {auth } from '../services/firebaseService'

import Loading from './Loading'
import Sidebar from './Sidebar'
import ChatHeader from './ChatHeader'
import SignOut from './SignOut'
import { ChatRoom } from './ChatRoom'

export default function Chat() {

    const [data, setData] = useState()
    const [user] = useAuthState(auth)
    const [userChat, setUserChat] = useState(null)

    const [sidebar, setSidebar] = useState(false)
    const showSidebar = () => setSidebar(!sidebar)

    const UserData = (DataUser) => {
        setData(DataUser)
    }

    return(
        <div className='text-white md:rounded-3xl grid grid-cols-12 grid-rows-6 w-full h-full overflow-hidden drop-shadow-2xl shadow-inner'>
            <div className={`fixed md:block z-20 ${sidebar ? 'sidebarOut left-[-100%]' : 'sidebar left-[0]'} md:relative col-span-3 row-span-full h-full w-3/5 md:w-auto`}>
            <div className={`md:hidden fixed z-20 left-[0] text-[2.5rem] p-2`}>
                    {sidebar ? <FaBars onClick={showSidebar}/> : <FaTimes onClick={showSidebar}/>}
            </div>
                <header className='flex justify-end row-span-1 col-span-3 p-4 color2 overflow-hidden drop-shadow-xl'>
                    <SignOut/>
                </header>
                <div className='col-span-3 row-start-2 row-end-6 overflow-y-auto color3 drop-shadow-xl h-full'>
                    {data ? <Sidebar setUserChat={setUserChat} userChat={userChat} UserData={data}/> : <Loading/>}
                </div>
            </div>
            <section onClick={() => !sidebar && setSidebar(true)} className='inline-flex overflow-hidden flex-col col-span-full md:col-span-9 row-span-6 color4'>
                <ChatHeader userChat={userChat}/>
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

    const [messageClass,setMessageClass] = useState()
    useEffect(() => {
    if(uid){
        uid === auth.currentUser.uid ? setMessageClass('sent') : setMessageClass('received')
    }else{
        userID === CurrentUserID ? setMessageClass('sent') : setMessageClass('received')
    } 
    })
    


    return (
    <div className={`div${messageClass} ml-2`}>
            
        <div className={`${messageClass} inline-flex m-5 rounded-xl brightness-125 py-1 px-2`}>

            <img className='h-[35px] rounded-full mr-2 w-auto -translate-y-6 -translate-x-6' src={photo} referrerPolicy="no-referrer"/>
            <div>
                <div className='flex font-thin text-[0.5rem] h-auto w-auto'>
                    <span className='text-base font-normal float-left -translate-x-8 m-1'>{username}<span className='ml-1 text-[0.5rem] font-thin'>{userID}</span></span>
                    <span className='float-right my-auto ml-auto'> {day}/{month} {hours}:{minutes}</span>
                </div>
            <p className='m-2 font-extralight break-all -translate-x-9 mt-0'>{text}</p>
            </div>
        </div>
    </div>
    )
    
}