import { ChatMessage } from "./Chat";

import { useState, useRef, useEffect } from 'react'

import { db } from '../services/firebaseService'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import { query } from "firebase/firestore";
import { TextField } from "@mui/material";
import { IoSend } from "react-icons/io5";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firestore = firebase.firestore();

export default function PrivateChat({userChat, setShowAlert}){

    const docId = userChat.chatId

    const q = query(db.collection('privateChat').doc(docId).collection('messages').orderBy('createdAt'))
    const [messagesRef] = useCollectionData(q)

    const refBody = useRef('')

    useEffect(() => {
        if (refBody.current.scrollHeight > refBody.current.offsetHeight){
            refBody.current.scrollTop =
            refBody.current.scrollHeight - refBody.current.offsetHeight
        }
    },[messagesRef])

    const [formValue, setFormValue] = useState('')

    const sendMessage = async(e) => {
       e.preventDefault(); 

        if(formValue.length > 0){
        const photoURL = userChat.UserData.photoURL
        const userID = userChat.UserData.userID
        const username = userChat.UserData.username


        firestore.collection('privateChat').doc(docId).collection('messages').add
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
        if(formValue.length == 0){
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

    return(
        <div className='flex flex-col place-content-end h-full w-full overflow-hidden '>
            <main className='h-full overflow-y-auto scroll-smooth pt-3' ref={refBody}>
                { messagesRef && messagesRef.map((msg, index) => <ChatMessage key={index} message={msg} CurrentUserID={userChat.UserData.userID}/> )}


            </main>

            <form className='flex m-2 p-2 px-4 pt-0 drop-shadow-xl shadow-inner rounded-[2rem] overflow-hidden bg-[rgba(32,36,53,0.85)]' onSubmit={sendMessage}>
                <div className="h-full w-full">
                <TextField
                variant='standard'
                className='w-full h-full'
                value={formValue} onChange={(e) => setFormValue(e.target.value)}
                InputProps={{
                endAdornment: (
                    <button disabled={isDisabled} className={`${isDisabled && 'saturate-0'} transition rounded-full text-[2rem] p-3 m-1 float-right color5`} type="submit"><IoSend/></button>
                )
                }}
                />
                </div>
                
            </form>
        </div>
    )
}