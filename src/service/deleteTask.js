import { doc, deleteDoc } from 'firebase/firestore';
import { firestore } from './firebase'; // Import your Firestore instance

export default async function HandleDeleteTask(id) {
  try {
    // Define the Firestore document reference for the task with the given ID
    const taskDocRef = doc(firestore, 'todos', id);

    // Delete the document
    await deleteDoc(taskDocRef);

    console.log('Task deleted successfully.');
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}