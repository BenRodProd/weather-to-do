import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase'; // Import your Firestore instance

export default async function updateTaskInDatabase(
  id,
  name,
  dependsOnWeather,
  weatherOption,
  isAllDay,
  timeOption,
  doesRepeat,
  repeatOption,
  user
) {
  
  try {
    // Define the Firestore document reference for the task with the given ID
    const taskDocRef = doc(firestore, 'todos', id);

    // Update the document with the new values
    await updateDoc(taskDocRef, {
      name,
      dependsOnWeather,
      weatherOption,
      isAllDay,
      timeOption,
      doesRepeat,
      repeatOption,
      user
    });
 
  } catch (error) {
   
  }
}
