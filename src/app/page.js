"use client"
import { useState, useEffect } from "react";
import Main from "./main";
import { auth } from "@/service/firebase";
import Login from "@/service/login";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUser(user); // Set the user object
        setLoggedIn(true);
        console.log(user, loggedIn);
      } else {
        // User is signed out
        setUser(null); // Clear the user object
        setLoggedIn(false);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);


  return (
    <>
      {loggedIn ? <Main user = {user} /> : <Login />}
    </>
  );
}
