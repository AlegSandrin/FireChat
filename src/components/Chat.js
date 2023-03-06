import { useState, useRef, useEffect } from 'react'


import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

import { FaSignOutAlt } from 'react-icons/fa'
import { MdContactMail } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const auth = firebase.auth()
const firestore = firebase.firestore();

export default function Chat() {

    const [user] = useAuthState(auth);

    return(
        <div className='text-white rounded-3xl grid grid-cols-12 grid-rows-8 h-full w-full overflow-hidden drop-shadow-2xl shadow-inner'>
            <header className='row-span-1 col-span-3 p-4 color2 overflow-hidden'>
                <SignOut/>
            </header>
            <div className='col-span-3 row-start-2 row-end-7 overflow-y-auto color1'>
            <div className='flex gap-1 text-xl ml-4 mt-3'>
                <MdContactMail/>
                <h1 className=''>Contatos</h1>
                </div>
            </div>
            <section className='inline-flex col-span-9 row-span-6 col-start-4 overflow-hidden color4 pt-4'>
                {user ? <ChatRoom /> : <SignIn />}
            </section>
        </div>
    )
}


function SignIn() {

    const navigate = useNavigate()

    const SignInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
        navigate('/confirm')
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

    const navigate = useNavigate()
    const [data, setData] = useState()

    useEffect(() => {
        const verifUsersDB = async () => {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await sleep(1000)
        const user = auth.currentUser;
    
        if(user){
        const db = getFirestore();
        const usersRef = doc(db, "usersDB", user.uid)
        const docs = await getDoc(usersRef)
        const dataUser = docs.data()
        setData(dataUser)
        if(dataUser == null || undefined){
            navigate('confirm')
        }
}}

    verifUsersDB()
    },[])


    const ScrollToEnd = useRef()

    const messagesRef = firestore.collection('messages'); 
    const query = messagesRef.orderBy('createdAt');

    const [messages] = useCollectionData(query); // Atualiza as informações conforme o banco de dados

    const [formValue, setFormValue] = useState('')

    const sendMessage = async(e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;
        await messagesRef.add({
            text: formValue, // Mensagem
            createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Quando foi enviada
            uid, // UID do usuário
            photoURL,
            username: data.username
        })

        setFormValue('') // Reseta o valor do form

        ScrollToEnd.current.scrollIntoView({ behavior: 'smooth'})
    }

    return(
        <>
        <div className='flex flex-col place-content-end h-full w-full'>
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
        </>
    )

}

function ChatMessage(props) {

    const { text, uid, photoURL, createdAt, username } = props.message;
    const ts_ms = new Date(createdAt * 1000); // timestamp para milisegundos
    var date = new Date(ts_ms); // inicia um novo objeto Date
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // mes
    var day = ("0" + (date.getDate() + 1)).slice(-2); // dia
    var hours = ("0" + date.getHours()).slice(-2); // horas
    var minutes = ("0" + date.getMinutes()).slice(-2); // minutos

    const photo = photoURL;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

    return (
    <div className={`div${messageClass} ml-2`}>
            
        <div className={`${messageClass} inline-flex m-5 rounded-xl brightness-125 py-1 px-2`}>
            <img className='h-[35px] rounded-full mr-2 w-auto -translate-y-6 -translate-x-6' src={photo}/>
            <div>
                <div className='flex font-thin text-[0.5rem] h-auto w-auto'>
                    <span className='text-base font-normal float-left -translate-x-8 m-1'>{username}</span>
                    <span className='float-right my-auto ml-auto'> {day}/{month} {hours}:{minutes}</span>
                </div>
            <p className='m-2 font-extralight text-sm -translate-x-9 mt-0'>{text}</p>
            </div>
        </div>
    </div>
    )
}

