import { auth } from '@/service/firebase'; // Import the 'auth' object from your Firebase setup

export default async function handleLogout() {
  try {
    await auth.signOut(); // Sign the user out
  } catch (error) {
    console.error('Error logging out:', error);
  }
}
