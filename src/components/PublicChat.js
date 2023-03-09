import { ChatMessage } from "./Chat";

import { useState, useRef, useEffect } from 'react'

import { auth } from '../services/firebaseService'
import firebase from 'firebase/compat/app'


import { useCollectionData } from 'react-firebase-hooks/firestore'

const firestore = firebase.firestore();

export default function PublicChat(props){
    const [data, setData] = useState()

    useEffect(() => {
     setData(props.data)
    },[props])
    
 
    const ScrollToEnd = useRef()

    const messagesRef = firestore.collection('messages'); 
    const query = messagesRef.orderBy('createdAt');

    const [messages] = useCollectionData(query); // Atualiza as informações conforme o banco de dados

    const [formValue, setFormValue] = useState('')

    const sendMessage = async(e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;
        const username = data.username;
        await messagesRef.add({
            text: formValue, // Mensagem
            createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Quando foi enviada
            uid, // UID do usuário
            photoURL,
            username: username
        })

        setFormValue('') // Reseta o valor do form

        ScrollToEnd.current.scrollIntoView({ behavior: 'smooth'})
    }

    return(
        <div className='flex flex-col place-content-end h-full w-full overflow-hidden'>
            <main className='h-full overflow-y-auto'>
                { messages && messages.map((msg,index) => <ChatMessage key={index} message={msg}/> )}

                <div ref={ScrollToEnd}></div>

            </main>

            <form className='flex m-4 rounded-xl overflow-hidden' onSubmit={sendMessage}>

                <input
                className='w-full h-full p-4 text-black outline-0'
                value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

                <button className='border-l-2 p-2 px-5 float-right color5 border-none' type="submit">Enviar</button>

            </form>
        </div>
    )
}