import { getServerSession } from 'next-auth';
// import { useState } from 'react';
// import { Box, Stack, TextField, Button } from '@mui/material';
import Chatbot from '@/components/Chatbot';


export default async function Home() {
  const session = await getServerSession()
  // if (session) {
  //   // grab user data for chatbot?

  // }

  return (
    <>
    {/* {session?.user?.name ? (
      <div>{session?.user?.name}</div>
    ) : (
      <></>
    )} */}
    <Chatbot />
    </>
  );
}
