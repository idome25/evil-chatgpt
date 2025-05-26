import React from 'react';
import Chat from './components/Chat'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#343541]">
      <main className="flex-1 flex flex-col items-center w-full overflow-y-auto bg-[#343541]">
        <div className="w-full max-w-2xl flex-1 flex flex-col justify-end px-4 sm:px-8">
          <Chat />
        </div>
      </main>
    </div>
  )
} 