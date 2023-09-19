import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from './firebase'; // Import your Firestore instance

export default async function HandleDeleteTaskFinally(id) {
  try {
    // Define the Firestore document reference for the task with the given ID
    const taskDocRef = doc(firestore, 'todos', id);

    // Get the task document data
 
        // Delete the document
        await deleteDoc(taskDocRef);
      }
    
   catch (error) {
    
  }
}
