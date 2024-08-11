import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // your Firebase config file

export const getMessagesByConversationId = async (conversationId) => {
  const messagesRef = collection(db, 'conversations', conversationId, 'messages');
  const q = query(messagesRef, orderBy('timestamp'));
  const querySnapshot = await getDocs(q);

  const messages = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return messages;
};
