"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, LogOut } from "lucide-react";
import { getProfile } from "@/lib/auth";

export default function Navbar() {
  const [name,setName] = useState("")
  const [user, setUser] = useState<any>(null)
  
  const router = useRouter()

  //gets user 
  useEffect(()=>{
    async function loadUser(){
      //show cached user

      const storedUser = localStorage.getItem('user');

      if(storedUser){
        setUser(JSON.parse(storedUser))
      }

      //fetch latest user from backend
      try {
        const data = await getProfile();

        setUser(data.user);

        //update cahce
        localStorage.setItem('user',JSON.stringify(data.user))

      } catch (error) {
        console.error(error);

        localStorage.removeItem("token")
        localStorage.removeItem("user")

        router.push('/login')
      }
    }

    loadUser()

  },[router]);


  function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")

    router.push('/login')
  }


  return (
    <header className="bg-white border-b h-20 shadow px-8 flex justify-between items-center">
      <div>
      <h2 className="text-2xl font-bold text-slate-800">
        Dashboard
      </h2>

      <p className="text-gray-500">
        Welcome
      </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <Search size={18}
          className="absolute left-4 top-3 text-gray-400"/>

          <input placeholder="Search..."
          className="pl-11 pr-4 py-2 border rounded-xl w-72 outline-none focus:ring-2 focus:ring-blue-500"/>

        </div>

        <button className="relative">
          <Bell/>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-white text-xs rounded-full w-5 h-5 flex justify-center items-center">
            3
          </span>
        </button>

        <div className="text-right">
          <h3 className="font-semibold">
            {user?.name}
          </h3>

          <p className="text-gray-500 text-sm capitalize">
            {user?.role}
          </p>

        </div>

        <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex justify-center items-center font-bold text-lg">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <button onClick={logout}
        className="bg-red-500 hover:bg-red-600 transition text-white p-3 rounded-xl">
          <LogOut size={18}/>
        </button>
      </div>
    </header>
  );
}