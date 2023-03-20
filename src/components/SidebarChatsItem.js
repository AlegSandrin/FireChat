import { useEffect, useMemo, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore"
import { MdPerson } from "react-icons/md"
import { db } from "../services/firebaseService"

const getUser = (users, userLogged) => 
   users?.filter((user) => user !== userLogged)[0]; 


export default function SidebarChatsItem({id, users, user, setUserChat, active, UserData}) {
    
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
    
    const handleNewChat = () => {
        const userChat = {
            chatId: id,
            username: User.username,
            photoURL: User.photoURL,
            userID: User.userID,
            UserData: UserData
        }

        setUserChat(userChat)
    }
    
    return(
    <div className={`${active} border-t-[1px] border-b-[1px] border-opacity-30 border-gray-100 color3 flex items-center md:gap-2 hover:bg-[#a34373] transition cursor-pointer gap-1 p-2`} onClick={handleNewChat}>
        {User ? <img className="xl:w-[60px] lg:w-[50px] w-[40px] rounded-full" alt="Imagem do Usuário" src={User.photoURL} referrerPolicy="no-referrer" /> : <MdPerson/>}
        <span className="text-sm lg:text-base xl:text-lg text-ellipsis overflow-hidden">{User?.username}</span>
    </div>
    )

}