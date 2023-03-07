import { useAuthState } from "react-firebase-hooks/auth";
import { Outlet } from "react-router-dom";
import Loading from "./components/Loading";
import SignIn from "./pages/SignIn";
import {auth} from "./services/firebaseService";


function App() {

  const [user, loading] = useAuthState(auth)

  if (loading) return <Loading/>

  if (!user) return <SignIn/>

  return (
    <div className="App h-full w-full">
      <Outlet/>
    </div>
  );
}

export default App;
