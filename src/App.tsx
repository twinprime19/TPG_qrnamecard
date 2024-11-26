import React, { useState, useCallback, useEffect } from 'react';
import { Sparkles, Bot } from 'lucide-react';
import NameInput from './components/NameInput';
import NameCloud from './components/NameCloud';
import RankingList from './components/RankingList';
import { containsProfanity } from './utils/profanityFilter';
import { BotName } from './types';

function App() {
  const [names, setNames] = useState<BotName[]>([
    { id: '1', text: 'Bolt', votes: 15 },
    { id: '2', text: 'Nova', votes: 12 },
    { id: '3', text: 'Nexus', votes: 8 },
    { id: '4', text: 'Echo', votes: 6 },
    { id: '5', text: 'Astra', votes: 10 },
    { id: '6', text: 'Cipher', votes: 7 },
  ]);
  const [lastVoteTime, setLastVoteTime] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const handleNewName = (name: string) => {
    if (containsProfanity(name)) {
      setError('Please keep suggestions family-friendly!');
      return;
    }

    if (names.some(n => n.text.toLowerCase() === name.toLowerCase())) {
      setError('This name has already been suggested!');
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
    const now = Date.now();
    if (now - lastVoteTime < 1000) {
      setError('Please wait 1 second between votes');
      return;
    }

    setNames(prev => prev.map(name =>
      name.id === id ? { ...name, votes: name.votes + 1 } : name
    ));
    setLastVoteTime(now);
    setError('');
  }, [lastVoteTime]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (error) setError('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <header className="pt-12 pb-32 bg-gradient-to-b from-white/50 to-transparent">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-12 h-12 text-indigo-600" />
            <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Name Our AI Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help us choose the perfect name for our AI assistant! Submit your suggestions
            and vote for your favorites.
          </p>
        </div>
      </header>

      <NameInput onSubmit={handleNewName} />
      <RankingList names={names} />
      
      <main className="container mx-auto px-4 flex flex-col items-center justify-center -mt-16">
        {error && (
          <div className="fixed top-32 left-1/2 transform -translate-x-1/2 mb-8 p-4 bg-red-100 text-red-700 rounded-lg animate-fade-in z-20">
            {error}
          </div>
        )}

        <NameCloud names={names} onVote={handleVote} />

        <div className="fixed bottom-4 right-4 text-sm text-gray-500">
          {lastVoteTime > 0 && Date.now() - lastVoteTime < 1000 && (
            <span className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg animate-fade-in">
              Wait {Math.ceil((1000 - (Date.now() - lastVoteTime)) / 1000)}s to vote again
            </span>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;