import { ChatMessage } from './ChatMessage'

import { useState, useRef, useEffect, useMemo } from 'react'

import { auth } from '../services/firebaseService'
import firebase from 'firebase/compat/app'

import { useCollectionData } from 'react-firebase-hooks/firestore'
import { TextField } from "@mui/material";
import { IoSend } from "react-icons/io5";

const firestore = firebase.firestore();

export default function PublicChat({userData, setShowAlert}){
    
    const [msgQuery, setMsgQuery] = useState()

    useMemo(() => {
        const messagesQuery = firestore.collection('messages'); 
        const q = messagesQuery.orderBy('createdAt');
        setMsgQuery(q)
    },[firestore])

    useEffect(() => {
    },[msgQuery])

    const [messages,loading,error,querySnapshot] = useCollectionData(msgQuery)

    const docRef = []
        querySnapshot?.forEach(function(doc){
        docRef.push(doc.ref)
        })   

    const [formValue, setFormValue] = useState('')

    const refBody = useRef('')

    useEffect(() => {
        if (refBody.current.scrollHeight > refBody.current.offsetHeight){
            refBody.current.scrollTop =
            refBody.current.scrollHeight - refBody.current.offsetHeight
        }
    },[messages])

    const sendMessage = async(e) => {
        const messagesRef = firestore.collection('messages'); 
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
                { messages && messages.map((msg,index) => <ChatMessage key={index} message={msg} docRef={docRef[index]}/> )}
            </main>

            <form className='flex m-2 p-2 px-4 pt-0  drop-shadow-xl shadow-inner rounded-[2rem] overflow-hidden opacity-80 bg-[rgba(32,36,53,0.85)]' onSubmit={sendMessage}>
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