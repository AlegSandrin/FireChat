import { auth } from "../services/firebaseService";
import { FaSignOutAlt } from "react-icons/fa";

export default function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>
                <FaSignOutAlt className="text-3xl"/>
        </button>
    )
}