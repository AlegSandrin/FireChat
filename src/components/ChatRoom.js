import { useMemo } from "react";
import useChat from "../chatState";
import PrivateChat from "./PrivateChat";
import PublicChat from "./PublicChat";

export function ChatRoom({setShowAlert}) {
    const userChat = useChat((state) => state.userChat)
    return(
        useMemo(() => {
            if(Object.keys(userChat).length == 0){
                return <PublicChat setShowAlert={setShowAlert} />
            }
            else{
                return <PrivateChat setShowAlert={setShowAlert}/>
            }
        },[userChat])
    )

}