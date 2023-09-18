import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from './firebase'; // Import your Firebase instance

async function HandleUpdateTaskDate(taskId) {
  try {
    const taskRef = doc(firestore, 'todos', taskId);

    // Update the task document with the current date
    await updateDoc(taskRef, {
      date: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating task date:', error);
  }
}
