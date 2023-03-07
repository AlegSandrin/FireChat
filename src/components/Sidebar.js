import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocumentData } from "react-firebase-hooks/firestore";
import { MdContactMail } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { doc, getDoc, getFirestore, collection} from "firebase/firestore";
import { useEffect, useState } from "react";
import firebase from 'firebase/compat/app'
import { db, auth } from '../services/firebaseService'

const Sidebar = ({setUserChat, userChat, UserData}) => {

    const [user] = useAuthState(auth)
    const [data, setData] = useState()

    useEffect(() => {
        if(UserData){
            setData(UserData)
        }
        
    },[UserData])


    const refChat = db
    .collection('privateChat')
    .where('users', 'array-contains', UserData.userID)
    const [chatsSnapshot] = useCollection(refChat)

    const handleCreateChat = () => {
        const idInput = prompt("Escreva o ID do usuário")

        if(idInput === UserData.userID){
            return alert("Insira um ID de usuário diferente do seu!")
        } else if(chatExists(idInput)){
            return alert("Contato já adicionado!")
        }

        db.collection('chats').add({
            users: [UserData.userID, idInput]
        })
    }

    const chatExists = (chatID) => {
        return !!chatsSnapshot?.docs.find(
            (chat) => chat.data().users.find((user) => user === chatID)?.length > 0
        )
    }

    return (
        <div className='flex gap-1 text-xl ml-4 mt-3'>
                <MdContactMail/>
                <h1 className=''>Contatos</h1>
                <IoMdAddCircle className="cursor-pointer" />
                <div setUserChat={setUserChat} userChat={userChat}>

                </div>
        </div>
    )
}

export default Sidebar