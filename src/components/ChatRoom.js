import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebaseService";
import PrivateChat from "./PrivateChat";
import PublicChat from "./PublicChat";

export function ChatRoom({UserData, userChat}) {

    const navigate = useNavigate()
    const [data, setData] = useState()
    const [user] = useAuthState(auth)

    useEffect(() => {
        const verifUsersDB = async () => {
    
        if(user){
        const usersRef = doc(db, "usersDB", user.uid)
        const docs = await getDoc(usersRef)
        const dataUser = docs.data()
        setData(dataUser)
        UserData(dataUser)
    }}
    verifUsersDB()
},[])

    return(
        userChat ? <PrivateChat userChat={userChat}/> : <PublicChat data={data} />
    )

}