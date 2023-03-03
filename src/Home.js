import { useState, useRef } from 'react'

import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import photoURL from './assets/img/avatar.png'

import { FaSignOutAlt } from 'react-icons/fa'
import { MdContactMail } from 'react-icons/md'

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
        <div className='Chat w-[100wh] h-[100vh] p-12'>
            <div className='bg-slate-800 text-white rounded-3xl grid grid-cols-12 grid-rows-8 mx-auto my-auto h-full w-full overflow-hidden drop-shadow-2xl shadow-inner'>
                <header className='row-span-1 col-span-3 p-4 color2 overflow-hidden'>
                    <SignOut/>
                </header>
                <div className='col-span-3 row-start-2 row-end-7 overflow-y-auto color1'>
                <div className='flex gap-1 text-xl ml-4 mt-3'>
                    <MdContactMail/>
                    <h1 className=''>Contatos</h1>
                    </div>
                </div>
                <section className='col-span-9 row-span-6 col-start-4 overflow-hidden color4'>
                    {user ? <ChatRoom /> : <SignIn />}
                </section>
            </div>
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
        <button onClick={() => auth.signOut()}>
            <div className='flex gap-1 text-xl'>
            <FaSignOutAlt/>
            <span className='text-base'>Sair</span>
            </div>
            </button>
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
        <div className='flex flex-col place-content-end h-full w-full'>
            <main className='place-content-start h-full overflow-y-auto'>
                { messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>) }

                <div ref={ScrollToEnd}></div>

            </main>

            <form className='flex m-4 rounded-xl overflow-hidden' onSubmit={sendMessage}>

                <input
                className='w-full h-full p-4 overscroll-contain text-black outline-0'
                value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

                <button className='border-l-2 p-2 px-5 float-right color5 border-none' type="submit">Enviar</button>

            </form>
        </div>
        </>
    )

}

function ChatMessage(props) {
    const { text, uid } = props.message;

    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
        <div className={`message ${messageClass} flex m-5 rounded-xl color4 brightness-125`}>
            <img className='h-[40px] rounded-full m-2 w-auto' src={photoURL}/>
            <p className='m-2 font-extralight text-sm'>{text}</p>

        </div>
    )
}

