import { IoIosPeople } from "react-icons/io";
import { MdPerson } from "react-icons/md";


export default function ChatHeader({userChat}){
    const username = userChat?.username
    const photoURL = userChat?.photoURL
    const userID = userChat?.userID
    if(userChat){
    return(
            <header className='flex items-center color2 pl-16 p-3 md:p-5 w-full drop-shadow-xl border-l-[2px] border-opacity-30 border-gray-700 gap-2'>
                {photoURL ? <img className="xl:w-[50px] lg:w-[40px] w-[35px] rounded-full" src={photoURL} alt='Avatar'/> : <MdPerson/>}
                <span className="text-base lg:text-base xl:text-lg text-ellipsis overflow-hidden">{username}<span className='ml-1 text-[0.6rem] font-extralight'>{userID}</span></span>
            </header>
    )
    }
    else{
        return(
            <div className='color2 flex justify-center items-center p-3 gap-2'>
                <IoIosPeople className="text-[2.5rem]"/>
                <span className="text-xl text-ellipsis overflow-hidden">Chat Geral</span>
            </div>
        )
    }
}