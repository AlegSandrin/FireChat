import { Outlet } from "react-router-dom";
import initializeFireBase from "./services/firebaseService";

initializeFireBase()

function App() {
  return (
    <div className="App h-full w-full">
      <Outlet/>
    </div>
  );
}

export default App;
