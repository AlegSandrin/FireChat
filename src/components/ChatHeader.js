import { MdPerson } from "react-icons/md";


export default function ChatHeader({userChat}){
    const username = userChat.username
    const photoURL = userChat.photoURL
    return(
            <header className='flex items-center color2 p-5 w-full drop-shadow-xl border-l-[2px] border-opacity-30 border-gray-700 gap-2'>
                {photoURL ? <img className="xl:w-[50px] lg:w-[40px] w-[30px] rounded-full" src={photoURL} alt='Avatar'/> : <MdPerson/>}
                <span className="text-sm lg:text-base xl:text-lg text-ellipsis overflow-hidden">{username}</span>
            </header>
    )
}