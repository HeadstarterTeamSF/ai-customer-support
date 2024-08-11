import { collection, addDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // your Firebase config file

export async function createMessage(conversationId, messageContent, sender) {
    try {
        // Reference to the conversation's messages subcollection
        const messagesCollectionRef = collection(db, `conversations/${conversationId}/messages`);

        // Add a new message
        const newMessage = {
            messageText: messageContent,
            sender: sender,
            timestamp: new Date(),
        };

        // Add the document to Firestore
        const docRef = await addDoc(messagesCollectionRef, newMessage);
        console.log("Message created with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding message: ", error);
    }
}