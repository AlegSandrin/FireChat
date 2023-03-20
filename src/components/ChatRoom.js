import { useMemo } from "react";
import PrivateChat from "./PrivateChat";
import PublicChat from "./PublicChat";

export function ChatRoom({setShowAlert,userData, userChat}) {
    return(
        useMemo(() => {
            if(userChat == null){
                return <PublicChat setShowAlert={setShowAlert} userData={userData} />
            }
            else{
                return <PrivateChat setShowAlert={setShowAlert} userChat={userChat}/>
            }
        },[userChat])
    )

}