import { ChatMessage } from "./Chat";

import { useState, useRef, useEffect } from 'react'

import { db, auth } from '../services/firebaseService'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import { useCollection, useCollectionData } from 'react-firebase-hooks/firestore'
import { useAuthState } from "react-firebase-hooks/auth";
import { getDocs, query, QuerySnapshot } from "firebase/firestore";

const firestore = firebase.firestore();

export default function PrivateChat(props){

    const docId = props.userChat.chatId

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
        const photoURL = props.userChat.UserData.photoURL
        const userID = props.userChat.UserData.userID
        const username = props.userChat.UserData.username


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
        <div className='flex flex-col place-content-end h-full w-full overflow-hidden '>
            <main className='h-full overflow-y-auto scroll-smooth pt-3' ref={refBody}>
                { messagesRef && messagesRef.map((msg, index) => <ChatMessage key={index} message={msg} CurrentUserID={props.userChat.UserData.userID}/> )}


            </main>

            <form className='flex m-4 rounded-xl overflow-hidden' onSubmit={sendMessage}>
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