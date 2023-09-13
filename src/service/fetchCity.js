import { doc, getDoc } from 'firebase/firestore';
import { firestore } from './firebase'; // Import your Firestore instance

// Define a function to fetch the user's city from Firestore
async function fetchUserCityFromFirestore(userEmail) {
  try {
    const userDocRef = doc(firestore, 'user', userEmail); // Adjust the collection and document path as needed
    const docSnapshot = await getDoc(userDocRef);
    
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      
      return userData.city; // Assuming the user's city is stored in a field called 'city'
    } else {
      return null; // Return null if the user's document is not found
    }
  } catch (error) {
    console.error('Error fetching user city:', error);
    throw error; // Handle the error appropriately
  }
}

export default fetchUserCityFromFirestore;