import { useCollection } from "react-firebase-hooks/firestore";
import { MdContactMail } from "react-icons/md";
import { IoMdAddCircle, IoIosPeople } from "react-icons/io";
import { db} from '../services/firebaseService'
import SidebarChatsItem from "./SidebarChatsItem";

const Sidebar = ({setUserChat, userChat, UserData}) => {

    const refChat = db
    .collection('privateChat')
    .where('users', 'array-contains', UserData.userID)
    const [chatsSnapshot] = useCollection(refChat)
    
    const handleCreateChat = () => {
        const idInput = prompt("Escreva o ID do usuário")

        if(idInput === UserData.userID){
            return alert("Insira um ID de usuário diferente do seu!")
        } else if(chatExists(idInput)){
            return alert("Contato já adicionado!")
        }

        db.collection('privateChat').add({
            users: [UserData.userID, idInput]
        })
    }

    const chatExists = (chatID) => {
        return !!chatsSnapshot?.docs.find(
            (chat) => chat.data().users.find((user) => user === chatID)?.length > 0
        )
    }

    return (
        <div className='flex-col gap-1 text-xl'>
            <div className={`${userChat ? '' : 'active'} color3 flex justify-center border-opacity-30 border-gray-100 border-b items-center md:gap-2 hover:bg-[#a34373] transition cursor-pointer gap-1 p-3`} onClick={() => {setUserChat(null)}}>
                <IoIosPeople className="text-[2.5rem]"/>
                <span className="text-sm lg:text-base xl:text-lg text-ellipsis overflow-hidden">Chat Geral</span>
            </div>
            <div className="flex justify-between my-5 h-full w-full px-2">
                
            <div className="flex items-center gap-1">
            <MdContactMail className="text-2xl"/>
            <h1 className=''>Contatos</h1>
            </div>
                <div className="flex items-center text-3xl">
                <IoMdAddCircle className="cursor-pointer" onClick={handleCreateChat}/>
                </div>
            </div>
                {chatsSnapshot?.docs.map((item, index) => (
                <div className="h-full w-full" key={index}>
                <SidebarChatsItem
                setUserChat={setUserChat} 
                active={userChat?.chatId === item.id ? 'active' : ''}
                id={item.id}
                users={item.data().users}
                user={UserData.userID}
                UserData={UserData}
                />
                </div>
                ))
                    
                }
                
        </div>
    )
}

export default Sidebar