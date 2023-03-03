import { useState, useRef } from 'react'

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import photoURL from './assets/img/avatar.png'

firebase.initializeApp({
  apiKey: "AIzaSyC1Jv-EHjRSlq7jNGMKXO6P3QVyIWrf5Xc",
  authDomain: "mychat-155c4.firebaseapp.com",
  projectId: "mychat-155c4",
  storageBucket: "mychat-155c4.appspot.com",
  messagingSenderId: "770870955344",
  appId: "1:770870955344:web:ed4de687a3b5a8f409b055"
})

const auth = firebase.auth()
const firestore = firebase.firestore();

export default function Home() {

    const [user] = useAuthState(auth);

    return(
        <div className='chat'>
            <header>

            </header>

            <section>
                {user ? <ChatRoom /> : <SignIn />}
            </section>
        </div>
    )
}

function SignIn() {

    const SignInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }

    return (
        <button onClick={SignInWithGoogle}>Sign in with Google</button>
    )
}

function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign Out</button>
    )
}

function ChatRoom() {

    const ScrollToEnd = useRef()

    const messagesRef = firestore.collection('messages'); 
    const query = messagesRef.orderBy('createdAt').limit(25);

    const [messages] = useCollectionData(query, {idField: 'id'}); // Atualiza as informações conforme o banco de dados

    const [formValue, setFormValue] = useState('')

    const sendMessage = async(e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;

        await messagesRef.add({
            text: formValue, // Mensagem
            createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Quando foi enviada
            uid, // UID do usuário
            photoURL
        })

        setFormValue('') // Reseta o valor do form

        ScrollToEnd.current.scrollIntoView({ behavior: 'smooth'})
    }

    return(
        <>
        <div className='border border-black w-[500px] h-[80vh] mx-auto my-auto'>
            <main >
                { messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>) }

                <div ref={ScrollToEnd}></div>

            </main>

            <form onSubmit={sendMessage}>

                <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

                <button type="submit">Enviar</button>

            </form>
        </div>
        </>
    )

}

function ChatMessage(props) {
    const { text, uid } = props.message;

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <div className={`message ${messageClass}`}>
            <img className='h-[50px] w-auto' src={photoURL}/>
            <p>{text}</p>

        </div>
    )
}
