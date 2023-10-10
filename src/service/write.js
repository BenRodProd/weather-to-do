import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase'; // Import your Firestore instance

export default async function saveToDatabase(username, city) {
  // Define the Firestore document reference
  const userDocRef = doc(firestore, 'user', username); // Assuming 'username' is the document ID

  try {
    // Check if the document exists
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      // Document exists, update the city
      await updateDoc(userDocRef, { city: city });
    } else {
      // Document doesn't exist, create a new one
      await setDoc(userDocRef, { city: city });
    }
  } catch (error) {
    console.error(error);
  }
}
