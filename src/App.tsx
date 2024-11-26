import React, { useState, useCallback, useEffect } from 'react';
import { Sparkles, Bot } from 'lucide-react';
import NameInput from './components/NameInput';
import NameCloud from './components/NameCloud';
import RankingList from './components/RankingList';
import CountdownTimer from './components/CountdownTimer';
import { containsProfanity } from './utils/profanityFilter';
import { BotName } from './types';

function App() {
  const [names, setNames] = useState<BotName[]>([
    { id: '1', text: 'Estella', votes: 12 },
    { id: '2', text: 'Senturia', votes: 10 },
    { id: '3', text: 'Sen', votes: 8 },
    { id: '4', text: 'Astra', votes: 6 },
    { id: '5', text: 'Mimi', votes: 4 },
    { id: '6', text: 'Echo', votes: 2 },
    { id: '7', text: 'Nexus', votes: 1 }
  ]);
  const [error, setError] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNewName = (name: string) => {
    if (containsProfanity(name)) {
      setError('Xin chỉ đề xuất những tên phù hợp!');
      return;
    }

    if (names.some(n => n.text.toLowerCase() === name.toLowerCase())) {
      setError('Tên này có người đề xuất rồi, bạn hãy vote đi!!!');
      return;
    }

    setNames(prev => [...prev, {
      id: Date.now().toString(),
      text: name,
      votes: 1
    }]);
    setError('');
  };

  const handleVote = useCallback((id: string) => {
    setNames(prev => prev.map(name =>
      name.id === id ? { ...name, votes: name.votes + 1 } : name
    ));
    setError('');
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) setError('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <header className="pt-6 md:pt-12 pb-16 md:pb-32 bg-gradient-to-b from-white/50 to-transparent relative px-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-8 h-8 md:w-12 md:h-12 text-indigo-600" />
            <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-purple-500 animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Đặt tên cho Trợ Lý AI của chúng ta nào! 
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4 mb-6">
            Cuộc thi sẽ kết thúc sớm! Nhớ bỏ phiếu nhé!
          </p>
          <CountdownTimer />
        </div>
      </header>

      <div className="fixed top-4 right-4 z-30 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 md:hidden ${
        isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={() => setIsMobileMenuOpen(false)} />

      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-20 transform transition-transform duration-300 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-4">
          <NameInput onSubmit={handleNewName} />
          <div className="mt-4">
            <RankingList names={names} />
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <NameInput onSubmit={handleNewName} />
        <RankingList names={names} />
      </div>

      <main className="container mx-auto px-4 flex flex-col items-center justify-center -mt-8 md:-mt-16">
        {error && (
          <div className="fixed top-20 md:top-32 left-1/2 transform -translate-x-1/2 mb-8 p-4 bg-red-100 text-red-700 rounded-lg animate-fade-in z-20">
            {error}
          </div>
        )}

        <NameCloud names={names} onVote={handleVote} />
      </main>
    </div>
  );
}

export default App;