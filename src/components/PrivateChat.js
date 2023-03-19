import { ChatMessage } from "./Chat";

import { useState, useRef, useEffect } from 'react'

import { db, storage } from '../services/firebaseService'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import { query } from "firebase/firestore";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { IoClose, IoSend } from "react-icons/io5";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FaCamera } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { uuidv4 } from "@firebase/util";

const firestore = firebase.firestore();

export default function PrivateChat({userChat, setShowAlert}){

    const docId = userChat.chatId
    const photoURL = userChat.UserData.photoURL
    const userID = userChat.UserData.userID
    const username = userChat.UserData.username

    const messagesRef = firestore.collection('privateChat').doc(docId).collection('messages')

    const q = query(db.collection('privateChat').doc(docId).collection('messages').orderBy('createdAt'))
    const [messages,loading,error,querySnapshot] = useCollectionData(q)

    const docRef = []
        querySnapshot?.forEach(function(doc){
        docRef.push(doc.ref)
        })   

    const refBody = useRef('')
    useEffect(() => {
        if (refBody.current.scrollHeight > refBody.current.offsetHeight){
            refBody.current.scrollTop =
            refBody.current.scrollHeight - refBody.current.offsetHeight
        }
    },[messages])

    const [formValue, setFormValue] = useState('')

    const sendMessage = async (e) => {
       e.preventDefault(); 

        if(formValue.length > 0){
        
        await messagesRef.add
        ({
            text: formValue, 
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            userID: userID,
            photoURL: photoURL,
            username: username
        })
        setFormValue('') 
    }
    }

    const [isDisabled, setIsDisabled] = useState(true)

    useEffect(() => {
        if(formValue.length === 0){
            setIsDisabled(true)
        }
        else{
            setIsDisabled(false)
            if(formValue.length > 1000){
                const alert = {
                    severity:"warning",
                    setOpen:true, 
                    title: 'Mensagem muito longa',
                    message:'Número máximo de 1000 caracteres excedido'
                }
                setShowAlert(alert)
                setIsDisabled(true)
            }
            else{
                setIsDisabled(false)
            }
        }   
    },[formValue])

    const [imageUpload, setImageUpload] = useState(null)
    const [imageText, setImageText] = useState(formValue)

    const uploadImage = () => {
        if (imageUpload === null) return;
        handleClose()
        const imageRef = ref(storage, `privateChat/${docId}/${imageUpload.name + uuidv4()}` )
        uploadBytes(imageRef, imageUpload).then((promise) => {
            getDownloadURL(promise.ref).then((url) =>{
                firestore.collection('privateChat').doc(docId).collection('messages').add
                ({
                imageURL: url,
                text: imageText,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                userID: userID,
                photoURL: photoURL,
                username: username
                }) 
            })
        })
    }  

    const [open, setOpen] = useState(false);

    const previewImage = (input) => {
        setOpen(true);
            var reader = new FileReader()
            reader.onload = function(e){
                var imgPreview = document.getElementById('imgpreview');
                imgPreview.setAttribute('src', e.target.result);
            }
            reader.readAsDataURL(input);
    }

    const handleClose = () => {
    setOpen(false);
    setImageText('')
    };


    return(
    <>
        <Dialog fullWidth maxWidth='md' open={open} onClose={handleClose}>
            <DialogTitle color='secondary' borderBottom={3} sx={{backgroundColor:'secundary', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <span className="text-lg sm:text-xl md:text-2xl">Enviar Imagem</span>
                <button className='text-[3rem] rounded-full float-right' onClick={handleClose}><IoClose/></button>
            </DialogTitle>
            <DialogContent sx={{marginTop:2, justifyContent:'center', display:'flex'}}>
                    <img id="imgpreview" className='object-contain'></img>
            </DialogContent>
            <DialogActions sx={{paddingBottom:2, paddingRight:2, paddingLeft:3, gap:4}}>
                <TextField
                variant='outlined'
                className='w-full h-full'
                value={imageText} onChange={(e) => setImageText(e.target.value)}
                />
                    <button className='rounded-full text-[2rem] p-3 color5' onClick={uploadImage}><IoSend/></button>
                </DialogActions>
            </Dialog>

        <div className='flex flex-col place-content-end h-full w-full overflow-hidden'>

            <main className='h-full overflow-y-auto scroll-smooth pt-3' ref={refBody}>
                { messages && messages.map((msg, index) => <ChatMessage key={index} message={msg} docRef={docRef[index]} CurrentUserID={userChat.UserData.userID}/> )}
            </main>

            <div className="flex items-center">

            <label className="block cursor-pointer">
                <FaCamera className="text-4xl ml-4 mr-2"/>
                <input className="hidden" type="file" onChange={(e) => {setImageUpload(e.target.files[0], previewImage(e.target.files[0]))}}/>
            </label>
            
            <form className='flex m-2 p-2 px-4 pb-0 pt-0 drop-shadow-xl w-full shadow-inner rounded-[2rem] overflow-hidden bg-[rgba(32,36,53,0.85)]' onSubmit={sendMessage}>
             
                <TextField
                variant='standard'
                className='w-full h-full'
                value={formValue} onChange={(e) => {setFormValue(e.target.value); setImageText(e.target.value)}}
                InputProps={{
                endAdornment: (
                    <button disabled={isDisabled} className={`${isDisabled && 'saturate-0'} transition rounded-full text-[2rem] p-3 m-1 float-right color5`} type="submit"><IoSend/></button>
                )
                }}
                />
                
            </form>
            </div>
        </div>
    </>
    )
}