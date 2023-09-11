"use client"
import { useState, useEffect } from "react"
import Main from "./main"
import firebaseApp from "@/service/firebase";
import Login from "@/service/login";


export default function Home() {
const [loggedIn, setLoggedIn] = useState(false)
const [user, setUser] = useState(null)


console.log(user);




  return (
    <>
    {loggedIn ? <Main/> : <Login/>}
    </>
  )

}