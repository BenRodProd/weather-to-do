'use client';
import { useState, useEffect } from 'react';
import Main from './main';
import { auth } from '@/service/firebase';
import Login from '@/service/login';
import { Footer, Background } from './components/Styles';
import LoadingScreen from './components/LoadingScreen';

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUser(user); // Set the user object
        setLoggedIn(true);
        setLoading(false);
      } else {
        // User is signed out
        setUser(null); // Clear the user object
        setLoggedIn(false);
        setLoading(false);
      }
    });

    // Clean up the subscription when the component unmounts

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <>
      {loggedIn ? <Main user={user} /> : <Login />}
      <Background />
      <Footer>(c) 2023 BenRodProd</Footer>
    </>
  );
}
