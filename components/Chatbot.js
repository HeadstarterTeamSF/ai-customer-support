"use client"
import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

export default function Chatbot() {

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const sendMessage = async () => {
    setMessage('') // Clear the input field
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message }, // Add the user's message
      { role: 'assistant', content: '' }  // Placeholder for assistant's response
    ])

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    })

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let result = ''

    const processText = async ({ done, value }) => {
      if (done) {
        // When done, parse the result as markdown and return
        return marked.parse(result)
      }

      // Decode the chunk and append to the result string
      const text = decoder.decode(value || new Uint8Array(), { stream: true })
      result += text

      // Update the assistant's message in the UI
      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1] // Get the last message (assistant's placeholder)
        let otherMessages = messages.slice(0, messages.length - 1) // Get all other messages
        return [
          ...otherMessages,
          { ...lastMessage, content: result },  // Update the assistant's message with the accumulated text
        ]
      })

      // Read the next chunk
      return reader.read().then(processText)
    }

    // Start reading the response stream
    const finalMarkdown = await reader.read().then(processText)

    // If needed, handle the final parsed markdown result
    // For example, update the state or do something else with finalMarkdown
  }


  return (
    <div className="flex flex-col pt-24 h-screen w-full max-w-2xl mx-auto bg-background text-foreground" >
      <header className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <div className="font-medium">Customer Support Assistant</div>
            <div className="text-xs text-muted-foreground">Online</div>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4" >
        {messages.map((message, index) => (
          <div key={index} className={message.role === 'assistant' ? 'flex items-start gap-4' : 'flex items-start gap-4 justify-end'}>
            <div className={message.role === 'assistant' ? 'bg-card p-3 rounded-lg max-w-[80%] text-sm bg-gray-200' : 'bg-primary text-primary-foreground p-3 rounded-lg max-w-[80%] text-sm bg-gray-700 text-white'}>
              <div dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
              ></div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="sticky bottom-0 bg-background border-t px-4 py-3 flex items-center gap-2">
        <textarea
          className="flex w-full bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 min-h-[40px] rounded-2xl resize-none p-2 border border-neutral-400 shadow-sm"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-800 hover:bg-gray-700 text-white text-primary-foreground hover:bg-primary/90 w-8 h-8"
          type="submit"
          onClick={sendMessage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="m5 12 7-7 7 7"></path>
            <path d="M12 19V5"></path>
          </svg>
          <span className="sr-only">Send</span>
        </button>
      </div>
    </div>
  )
}