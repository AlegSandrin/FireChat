import { useMemo, useState } from 'react'

import { FaBars, FaTimes } from 'react-icons/fa'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../services/firebaseService'

import Loading from './Loading'
import Sidebar from './Sidebar'
import ChatHeader from './ChatHeader'
import SignOut from './SignOut'
import { ChatRoom } from './ChatRoom'
import ShowAlert from './ShowAlert'

export default function Chat({userData}) {

    const [user] = useAuthState(auth)
    const [userChat, setUserChat] = useState(null)
    const [showAlert, setShowAlert] = useState()
    const [sidebar, setSidebar] = useState(false)
    const showSidebar = () => setSidebar(!sidebar)

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    return(
    <div className='container max-w-full'>
        {showAlert?.setOpen === true && <ShowAlert showAlert={showAlert}/>}
        <div className='grid text-white grid-cols-12 grid-rows-6 drop-shadow-2xl shadow-inner overflow-hidden w-full h-full opacity-[0.85] brightness-110'>
            <div className={`fixed md:block z-20 ${sidebar ? 'sidebarOut left-[-100%]' : 'sidebar left-[0]'} md:relative col-span-3 row-span-full h-full w-3/5 md:w-auto`}>
            <div className={`md:hidden fixed z-20 left-[0] text-[2.5rem] p-2`}>
                    {sidebar ? <FaBars onClick={showSidebar}/> : <FaTimes onClick={showSidebar}/>}
            </div>
                <header className='flex md:justify-between justify-end gap-8 row-span-1 col-span-3 p-4 color2 overflow-hidden drop-shadow-xl'>
                    <img className='rounded-full md:h-12 h-10 w-auto' src={userData.photoURL}></img>
                    <SignOut/>
                </header>
                <div className='col-span-3 row-start-2 row-end-6 overflow-y-auto color3 drop-shadow-xl h-full'>
                    {useMemo(() => { if (userData){ return <Sidebar setShowAlert={setShowAlert} setUserChat={setUserChat} userChat={userChat} UserData={userData}/> } 
                    else { return <Loading/> } },[userChat] )}
                </div>
            </div>
            <section onClick={() => !sidebar && setSidebar(true)} className='Chat inline-flex overflow-hidden flex-col col-span-full md:col-span-9 row-span-6'>
                <ChatHeader userChat={userChat}/>
                {useMemo(() => {if(!user){ return <Loading/> } 
                else { return <ChatRoom setShowAlert={setShowAlert} userData={userData} userChat={userChat}/> }},[user, userChat] )}
            </section>
        </div>
    </div>
    )
}
