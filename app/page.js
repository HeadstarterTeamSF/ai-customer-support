import { getServerSession } from 'next-auth';
// import { useState } from 'react';
// import { Box, Stack, TextField, Button } from '@mui/material';
import Chatbot from '@/components/Chatbot';
import { getConversationsByUserId } from './db/getConversations';
import { getMessagesByConversationId } from './db/getMessages';
import { authOptions } from './api/auth/[...nextauth]/route';


export default async function Home() {
  const session = await getServerSession(authOptions)
  // get user messages (and conversations)
  console.log('server session', session?.user?.name)
  const conversations = session ? await getConversationsByUserId(session.user.uid) : []
  console.log('conversations', conversations[0]?.id)
  const messagesJSON = session ? await getMessagesByConversationId(conversations[0].id) : []
  console.log('messages', messagesJSON)
  const messages = JSON.parse(JSON.stringify(messagesJSON))

  return (
    <>
    {/* {session?.user?.name ? (
      <div>{session?.user?.name}</div>
    ) : (
      <></>
    )} */}
    <Chatbot name={session?.user?.name} conversationId={conversations[0]?.id} prevMessages={messages}/>
    </>
  );
}
