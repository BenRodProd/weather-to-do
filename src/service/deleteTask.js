import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from './firebase'; // Import your Firestore instance

export default async function HandleDeleteTask(id) {

  try {
    // Define the Firestore document reference for the task with the given ID
    const taskDocRef = doc(firestore, 'todos', id);

    // Get the task document data
    const taskDocSnapshot = await getDoc(taskDocRef);

    if (taskDocSnapshot.exists()) {
      // Check if the 'doesRepeat' field is set to 'on'
      const doesRepeat = taskDocSnapshot.data().repeatOption;

      if (doesRepeat !== 'no repeat') {
     
        // Update the 'date' field with the current date (or your desired logic)
        await setDoc(taskDocRef, { done: serverTimestamp() }, { merge: true });
      } else {
      
        // Delete the document
        await deleteDoc(taskDocRef);
      }
    }
  } catch (error) {
    console.error('Error deleting or updating task:', error);
  }
}
