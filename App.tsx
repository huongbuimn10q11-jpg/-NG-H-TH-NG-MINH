
import React, { useState } from 'react';
import PlayerUI from './components/PlayerUI';
import AdminUI from './components/AdminUI';

const App: React.FC = () => {
  const [view, setView] = useState<'player' | 'admin'>('player');

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation for Dev/Testing Purposes */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t flex justify-around p-4 z-50">
        <button
          onClick={() => setView('player')}
          className={`flex flex-col items-center gap-1 ${view === 'player' ? 'text-pink-600' : 'text-gray-400'}`}
        >
          <span className="text-2xl">🎮</span>
          <span className="text-xs font-bold">CHƠI GAME</span>
        </button>
        <button
          onClick={() => setView('admin')}
          className={`flex flex-col items-center gap-1 ${view === 'admin' ? 'text-indigo-600' : 'text-gray-400'}`}
        >
          <span className="text-2xl">👩‍🏫</span>
          <span className="text-xs font-bold">QUẢN LÝ</span>
        </button>
      </nav>

      {/* App Header */}
      <header className="bg-gradient-to-r from-pink-400 to-orange-400 p-6 text-center text-white shadow-lg mb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-funny drop-shadow-md">HỌC XEM GIỜ VUI VẺ</h1>
      </header>

      <main className="container mx-auto px-4">
        {view === 'player' ? <PlayerUI /> : <AdminUI />}
      </main>
    </div>
  );
};

export default App;
