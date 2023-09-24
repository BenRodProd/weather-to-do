import { doc, getDoc } from 'firebase/firestore';
import { firestore } from './firebase'; // Import your Firestore instance

// Define a function to fetch the user's city and style from Firestore
async function fetchUserCityAndStyleFromFirestore(userEmail) {
  try {
    const userDocRef = doc(firestore, 'user', userEmail); // Adjust the collection and document path as needed
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      const city = userData.city; // Assuming the user's city is stored in a field called 'city'
      const style = userData.style; // Assuming the user's style is stored in a field called 'style'
      
      return { city, style }; // Return an object with both city and style properties
    } else {
      return null; // Return null if the user's document is not found
    }
  } catch (error) {
    console.error('Error fetching user city and style:', error);
    throw error; // Handle the error appropriately
  }
}

export default fetchUserCityAndStyleFromFirestore;
