import { ChatMessage } from "./Chat";

import { useState, useRef, useEffect } from 'react'

import { auth } from '../services/firebaseService'
import firebase from 'firebase/compat/app'

import { useCollectionData } from 'react-firebase-hooks/firestore'
import { TextField } from "@mui/material";
import { IoSend } from "react-icons/io5";

const firestore = firebase.firestore();

export default function PublicChat({userData, setShowAlert}){

    const messagesRef = firestore.collection('messages'); 
    const query = messagesRef.orderBy('createdAt');

    const [messages] = useCollectionData(query); // Atualiza as informações conforme o banco de dados

    const [formValue, setFormValue] = useState('')

    const refBody = useRef('')

    useEffect(() => {
        if (refBody.current.scrollHeight > refBody.current.offsetHeight){
            refBody.current.scrollTop =
            refBody.current.scrollHeight - refBody.current.offsetHeight
        }
    },[messagesRef])

    const sendMessage = async(e) => {
        e.preventDefault();

        if(formValue.length > 0){

        const { uid, photoURL } = auth.currentUser;
        const username = userData.username;
        const userID = userData.userID
        await messagesRef.add({
            text: formValue, // Mensagem
            createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Quando foi enviada
            uid, // UID do usuário
            photoURL,
            username: username,
            userID: userID
        })

        setFormValue('') // Reseta o valor do form
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

    return(
        <div className='flex flex-col place-content-end h-full w-full overflow-hidden'>
            <main className='h-full overflow-auto overflow-x-hidden scroll-smooth pt-3' ref={refBody}>
                { messages && messages.map((msg,index) => <ChatMessage key={index} message={msg}/> )}

            </main>

            <form className='flex m-2 p-2 px-4 pt-0 drop-shadow-xl shadow-inner rounded-[2rem] overflow-hidden opacity-80 bg-[rgba(32,36,53,0.85)]' onSubmit={sendMessage}>
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
                
            </form>
        </div>
    )
}