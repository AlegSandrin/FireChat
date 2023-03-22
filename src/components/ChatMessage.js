import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { IoClose } from 'react-icons/io5'
import MessagesMenu from './MessagesMenu'
import { auth } from '../services/firebaseService'
import { useState, useEffect } from 'react'

export function ChatMessage(props) {
    const docRef = props.docRef
    const CurrentUserID = props.CurrentUserID
    const { text, uid, photoURL, createdAt, username, userID, imageURL, imagePath, editedAt } = props.message;

        const ts_ms = new Date(createdAt * 1000); // timestamp para milisegundos
        var date = new Date(ts_ms); // inicia um novo objeto Date
        var month = ("0" + (date.getMonth() + 1)).slice(-2); // mes
        var day = ("0" + (date.getDate() + 1)).slice(-2); // dia
        var hours = ("0" + date.getHours()).slice(-2); // horas
        var minutes = ("0" + date.getMinutes()).slice(-2); // minutos

        const ts_msEdit = new Date(editedAt * 1000); // timestamp para milisegundos
        var dateEdit = new Date(ts_msEdit); // inicia um novo objeto Date
        var monthEdit = ("0" + (dateEdit.getMonth() + 1)).slice(-2); // mes
        var dayEdit = ("0" + (dateEdit.getDate() + 1)).slice(-2); // dia
        var hoursEdit = ("0" + dateEdit.getHours()).slice(-2); // horas
        var minutesEdit = ("0" + dateEdit.getMinutes()).slice(-2); // minutos

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
    <Dialog fullWidth maxWidth='md' open={open} onClose={handleClose} >
        <DialogTitle sx={{backgroundColor:'secundary', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <span className="text-sm sm:text-lg md:text-xl">{username} - {createdAt}</span><button className='text-[2rem] p-3 rounded-full' onClick={handleClose}><IoClose/></button>
        </DialogTitle>
        <DialogContent sx={{justifyContent:'center', display:'flex'}}>
            <img src={image} className='object-contain'></img>
        </DialogContent>
        {text && <DialogContentText sx={{paddingLeft:3, paddingRight:3}}> {text} </DialogContentText> }
        <DialogActions sx={{paddingBottom:2, paddingRight:2, paddingLeft:3, gap:4}}>
            
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
                <div className='flex justify-between font-thin h-auto w-auto'>
                    <span className='text-base font-normal -translate-x-8 m-1'>{username}<span className='ml-1 text-[0.5rem] font-thin'>{userID}</span></span>
                    <span className='text-[0.5rem] my-auto ml-auto flex flex-col justify-end '> 
                        <span className='self-end text-right'>{day}/{month} {hours}:{minutes}</span>
                        <span className='self-end text-right'> {editedAt && `(editado às ${dayEdit}/${monthEdit} ${hoursEdit}:${minutesEdit})` } 
                        </span> 
                    </span>
                    {userID === CurrentUserID && <MessagesMenu docRef={docRef} imagePath={imagePath} editMessage={text} imageURL={imageURL}/>}
                    {uid === auth.currentUser.uid && <MessagesMenu docRef={docRef} imagePath={imagePath} editMessage={text} imageURL={imageURL}/>}
                </div>
            {imageURL && <img className='max-h-[250px] max-w-full mx-auto p-2 cursor-pointer' src={imageURL} onClick={() => {setOpen(true)}}></img>}
            {text && <p className='m-2 font-extralight break-all -translate-x-9 mt-0'>{text}</p>}
            </div>
        </div>
    </div>
 </>   
    )
    
}