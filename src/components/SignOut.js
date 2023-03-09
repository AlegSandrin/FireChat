import { auth } from "../services/firebaseService";
import { FaSignOutAlt } from "react-icons/fa";

export default function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>
            <div className='flex gap-1 text-xl'>
                <FaSignOutAlt/>
                <span className='text-base'>Sair</span>
            </div>
        </button>
    )
}