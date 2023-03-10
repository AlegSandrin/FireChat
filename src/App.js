import { useAuthState } from "react-firebase-hooks/auth";
import { Outlet } from "react-router-dom";
import Loading from "./components/Loading";
import SignIn from "./pages/SignIn";
import {auth} from "./services/firebaseService";


function App() {

  const [user, loading] = useAuthState(auth)

  if (loading) return( <div className="h-full w-full justify-center absolute"><Loading/></div> )

  if (!user) return <SignIn/>

  return (
      <Outlet/>
  );
}

export default App;
