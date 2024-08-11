import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // your Firebase config file

export const getConversationsByUserId = async (userId) => {
  try {
    // Reference to the 'conversations' collection
    const conversationsRef = collection(db, 'conversations');
    
    // Create a query to filter conversations by userID
    const q = query(conversationsRef, where('userId', '==', userId));
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    
    // Map the results to an array of conversation objects
    const conversations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    return conversations;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
};