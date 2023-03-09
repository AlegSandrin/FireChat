import { MdPerson } from "react-icons/md";


export default function ChatHeader({photoURL, username}){
    return(
            <header className='inline color3 h-20 w-full'>
                {photoURL ? <img src={photoURL} alt='Avatar'/> : <MdPerson/>}
                <span>{username}</span>
            </header>
    )
}