import PrivateChat from "./PrivateChat";
import PublicChat from "./PublicChat";

export function ChatRoom({setShowAlert,userData, userChat}) {

    return(
        userChat ? <PrivateChat setShowAlert={setShowAlert} userChat={userChat}/> : <PublicChat setShowAlert={setShowAlert} userData={userData} />
    )

}