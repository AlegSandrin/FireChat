import { IoIosPeople } from "react-icons/io";
import { MdPerson } from "react-icons/md";


export default function ChatHeader({userChat}){
    const username = userChat?.username
    const photoURL = userChat?.photoURL
    const userID = userChat?.userID
    if(userChat){
    return (
      <header className="color2 flex w-full items-center gap-2 border-l-[2px] border-gray-700 border-opacity-30 p-3 pl-16 drop-shadow-xl md:p-5">
        {photoURL ? (
          <img
            className="w-[35px] rounded-full lg:w-[40px] xl:w-[50px]"
            src={photoURL}
            alt="Avatar"
            referrerPolicy="no-referrer"
          />
        ) : (
          <MdPerson />
        )}
        <span className="overflow-hidden text-ellipsis text-base lg:text-base xl:text-lg">
          {username}
          <span className="ml-1 text-[0.6rem] font-extralight">{userID}</span>
        </span>
      </header>
    );
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