import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from './firebase'; // Import your Firestore instance

async function fetchUserTasksFromFirestore(user) {
  try {
    // Define a reference to the "todos" collection
    const todosCollectionRef = collection(firestore, 'todos');

    // Create a query to fetch tasks for the specific user
    const userTasksQuery = query(
      todosCollectionRef,
      where('user', '==', user)
    );

    // Execute the query and get the task documents
    const querySnapshot = await getDocs(userTasksQuery);

    // Extract and return the tasks as an array
    const userTasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return userTasks
        
   
    
  } catch (error) {
    console.error('Error fetching user tasks from Firestore:', error);
    throw error;
  }
}

export default fetchUserTasksFromFirestore;
