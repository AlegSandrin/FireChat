import { collection, collectionGroup, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useCollection, useCollectionData } from "react-firebase-hooks/firestore"
import { MdPerson } from "react-icons/md"
import { db } from "../services/firebaseService"

import useChat from "../chatState";

const getUser = (users, userLogged) => 
   users?.filter((user) => user !== userLogged)[0]; 


export default function SidebarChatsItem({id, users, user, active}) {
    
    const userData = useChat((state) => state.userData)
    const [DBref, setDBref] = useState()
    const [allUsers, setAllUsers] = useState()

    useEffect(() => {
    const getUsers = getUser(users, user)
    setAllUsers(getUsers)
    },[users])

    useMemo(() => {
    const ref = db.collection('usersDB').where('userID', '==', getUser(users, user))
    setDBref(ref)
    },[allUsers])
    
    const [getUserItem] = useCollection(DBref)
    
    const User = getUserItem?.docs?.[0]?.data()
    const setUserChat = useChat((state) => state.setUserChat);
    
    const handleNewChat = () => {
        
        const userChat = {
            chatId: id,
            username: User.username,
            photoURL: User.photoURL,
            userID: User.userID,
            userData: userData
        }
        
        setUserChat(userChat)
    }
    
    return (
      <div
        className={`${active} color3 flex cursor-pointer items-center gap-1 border-t-[1px] border-b-[1px] border-gray-100 border-opacity-30 p-2 transition hover:bg-[#a34373] md:gap-2`}
        onClick={handleNewChat}
      >
        {User ? (
          <img
            className="w-[40px] rounded-full lg:w-[50px] xl:w-[60px]"
            alt="Imagem do Usuário"
            src={User.photoURL}
            referrerPolicy="no-referrer"
          />
        ) : (
          <MdPerson />
        )}
        <span className="overflow-hidden text-ellipsis text-sm lg:text-base xl:text-lg">
          {User?.username}
        </span>
      </div>
    );

}