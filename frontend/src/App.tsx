import { Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Settings from "./pages/Settings"
import Profile from "./pages/Profile"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"

import {Loader} from 'lucide-react'
import {Toaster} from 'react-hot-toast'

const App = () => {

  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[authUser]);

  console.log(authUser);

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div>
      <Navbar/>

      <Routes>
          <Route path="/" element={authUser?<Home/>:<Navigate to="/login"/>}/>
          <Route path="/login" element={!authUser?<Login/>:<Navigate to="/"/>}/>
          <Route path="/signup" element={!authUser?<Signup/>:<Navigate to="/"/>}/>
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/profile" element={authUser?<Profile/>:<Navigate to="/login"/>}/>
      </Routes>

      <Toaster/>

    </div>
  )
}

export default App