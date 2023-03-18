import { useState, useEffect } from 'react'

import { FaBars, FaTimes } from 'react-icons/fa'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../services/firebaseService'

import Loading from './Loading'
import Sidebar from './Sidebar'
import ChatHeader from './ChatHeader'
import SignOut from './SignOut'
import { ChatRoom } from './ChatRoom'
import ShowAlert from './ShowAlert'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { IoClose } from 'react-icons/io5'

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
                    {userData ? <Sidebar setShowAlert={setShowAlert} setUserChat={setUserChat} userChat={userChat} UserData={userData}/> : <Loading/>}
                </div>
            </div>
            <section onClick={() => !sidebar && setSidebar(true)} className='Chat inline-flex overflow-hidden flex-col col-span-full md:col-span-9 row-span-6'>
                <ChatHeader userChat={userChat}/>
                {!user ? <Loading/> :  <ChatRoom setShowAlert={setShowAlert} userData={userData} userChat={userChat}/>}
            </section>
        </div>
    </div>
    )
}


export function ChatMessage(props) {

    const CurrentUserID = props.CurrentUserID
    const { text, uid, photoURL, createdAt, username, userID, imageURL } = props.message;
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
    
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
        };

    const showImage = (image, text, username, createdAt) => {
        return(
        <Dialog fullWidth maxWidth='md' open={open} onClose={handleClose}>
        <DialogTitle>{username} - {createdAt}</DialogTitle>
        <DialogContent sx={{justifyContent:'center', display:'flex'}}>
            <img src={image} className='object-contain'></img>
        </DialogContent>
        {text && <DialogContentText sx={{paddingLeft:3, paddingRight:3}}> {text} </DialogContentText> }
        <DialogActions sx={{paddingBottom:2, paddingRight:2, paddingLeft:3, gap:4}}>
            <button className='text-[2rem] p-3 rounded-full' onClick={handleClose}><IoClose/></button>
        </DialogActions>
    </Dialog>
    )
    }

    return (
<>
    {open && showImage(imageURL, text, username, `${day}/${month} ${hours}:${minutes}`)}

    <div className={`div${messageClass} opacity-90 ml-2`}>
            
        <div className={`${messageClass} inline-flex m-5 rounded-xl brightness-125 py-1 px-2`}>

            <img className='h-[35px] rounded-full mr-2 w-auto -translate-y-6 -translate-x-6' src={photo} referrerPolicy="no-referrer"/>
            <div>
                <div className='flex font-thin text-[0.5rem] h-auto w-auto'>
                    <span className='text-base font-normal float-left -translate-x-8 m-1'>{username}<span className='ml-1 text-[0.5rem] font-thin'>{userID}</span></span>
                    <span className='float-right my-auto ml-auto'> {day}/{month} {hours}:{minutes}</span>
                </div>
            {imageURL && <img className='max-h-[250px] max-w-full mx-auto p-2 cursor-pointer' src={imageURL} onClick={() => {setOpen(true)}}></img>}
            {text && <p className='m-2 font-extralight break-all -translate-x-9 mt-0'>{text}</p>}
            </div>
        </div>
    </div>
 </>   
    )
    
}