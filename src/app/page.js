"use client"
import { useState, useEffect } from "react";
import Main from "./main";
import { auth } from "@/service/firebase";
import Login from "@/service/login";
import styled from "styled-components";

const Footer = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: #000000;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  font-weight: bold;
  margin: 1rem;
`;

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUser(user); // Set the user object
        setLoggedIn(true);
       
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
      <Footer>(c) 2023 BenRodProd</Footer>
    </>
  );
}
