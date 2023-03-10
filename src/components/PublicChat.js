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
        const username = data.username;
        const userID = data.userID
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

    const keyDownHandler = (event) => {
        if ( event.shiftKey && event.key === 'Enter'){
        }
        else{
        if (event.key === 'Enter') {
          sendMessage(event)
        }
        
        }
    }

    return(
        <div className='flex flex-col place-content-end h-full w-full overflow-hidden'>
            <main className='h-full overflow-y-auto scroll-smooth pt-3' ref={refBody}>
                { messages && messages.map((msg,index) => <ChatMessage key={index} message={msg}/> )}

            </main>

            <form className='flex m-4 rounded-xl overflow-hidden' onSubmit={sendMessage} id='form'>
                <textarea
                id="msgarea"
                onKeyUp={keyDownHandler}
                onKeyDown={keyDownHandler}
                className='resize-none pl-2 pt-3 w-full h-full text-black outline-0'
                value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
                <button className='border-l-2 p-2 px-5 float-right color5 border-none' type="submit">Enviar</button>

            </form>
        </div>
    )
}