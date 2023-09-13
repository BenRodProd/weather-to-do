import { collection, addDoc } from 'firebase/firestore';
import { firestore } from './firebase'; // Import your Firestore instance

export default async function writeTaskToDatabase(
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
    // Define the Firestore collection reference
    const todosCollectionRef = collection(firestore, 'todos');

    // Create a new document with the form input values
    await addDoc(todosCollectionRef, {
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
