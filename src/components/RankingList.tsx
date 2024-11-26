import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Flame, Star, TrendingUp, TrendingDown, Clock, Download, Share2, ChevronLeft } from 'lucide-react';
import { BotName } from '../types';
import { sendToDiscord } from '../utils/discord';
import { motion, AnimatePresence } from 'framer-motion';

interface RankingListProps {
  names: BotName[];
}

interface EnhancedBotName extends BotName {
  trend: 'hot' | 'rising' | 'falling' | 'stale' | 'new';
  lastVoteTime: number;
}

const RankingList: React.FC<RankingListProps> = ({ names }) => {
  const [enhancedNames, setEnhancedNames] = useState<EnhancedBotName[]>([]);
  const [previousVotes, setPreviousVotes] = useState<Record<string, number>>({});
  const [isSharing, setIsSharing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const now = Date.now();
    const enhanced = names.map(name => {
      const prev = previousVotes[name.id] || 0;
      const voteDiff = name.votes - prev;
      const isNew = !previousVotes[name.id];
      const lastVoteTime = now - (Math.random() * 60000);

      let trend: EnhancedBotName['trend'] = 'stale';
      if (isNew) trend = 'new';
      else if (voteDiff > 2) trend = 'hot';
      else if (voteDiff > 0) trend = 'rising';
      else if (voteDiff < 0) trend = 'falling';
      else if (now - lastVoteTime > 30000) trend = 'stale';

      return {
        ...name,
        trend,
        lastVoteTime,
      };
    });

    setEnhancedNames(enhanced);
    setPreviousVotes(names.reduce((acc, name) => ({
      ...acc,
      [name.id]: name.votes
    }), {}));
  }, [names]);

  const sortedNames = [...enhancedNames]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 10);

  const maxVotes = Math.max(...names.map(n => n.votes));

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 animate-bounce" />;
      case 1:
        return <Medal className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 md:w-6 md:h-6 text-amber-700" />;
      default:
        return <span className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center font-bold text-gray-500">{index + 1}</span>;
    }
  };

  const getTrendIcon = (trend: EnhancedBotName['trend']) => {
    switch (trend) {
      case 'hot':
        return <Flame className="w-4 h-4 text-red-500 animate-pulse" />;
      case 'rising':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'falling':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      case 'new':
        return <Star className="w-4 h-4 text-yellow-400 animate-spin-slow" />;
      case 'stale':
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleDownload = () => {
    const data = sortedNames.map((name, index) => ({
      rank: index + 1,
      name: name.text,
      votes: name.votes,
      trend: name.trend,
      lastVoteTime: new Date(name.lastVoteTime).toISOString()
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-bot-names-leaderboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareToDiscord = async () => {
    setIsSharing(true);
    try {
      const data = sortedNames.map((name, index) => ({
        rank: index + 1,
        name: name.text,
        votes: name.votes,
        trend: name.trend
      }));
      await sendToDiscord(data);
    } catch (error) {
      console.error('Failed to share to Discord:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <motion.div
      className={`md:absolute md:top-6 ${isCollapsed ? 'md:left-0' : 'md:left-6'} bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 w-full md:w-80 transition-all duration-300`}
      animate={{ x: isCollapsed ? '-85%' : 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:flex items-center justify-center w-8 h-16 bg-white rounded-r-lg shadow-lg group hover:bg-indigo-50 transition-colors"
      >
        <ChevronLeft className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Name Race Leaderboard
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleShareToDiscord}
            disabled={isSharing}
            className={`p-2 hover:bg-indigo-50 rounded-lg transition-colors duration-200 group ${
              isSharing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Share to Discord"
          >
            <Share2 className={`w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform ${
              isSharing ? 'animate-spin' : ''
            }`} />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-indigo-50 rounded-lg transition-colors duration-200 group"
            title="Download Leaderboard"
          >
            <Download className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          className="space-y-3 max-h-[60vh] md:max-h-[70vh] overflow-y-auto custom-scrollbar"
          initial={false}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {sortedNames.map((name, index) => (
            <motion.div
              key={name.id}
              className="flex items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-indigo-50 animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {getRankIcon(index)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 truncate">{name.text}</span>
                  {getTrendIcon(name.trend)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1 overflow-hidden">
                  <div
                    className="bg-indigo-600 rounded-full h-2 transition-all duration-500 relative"
                    style={{
                      width: `${(name.votes / maxVotes) * 100}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-indigo-600 font-bold group-hover:scale-110 transition-transform">
                  {name.votes}
                </span>
                {name.trend === 'hot' && (
                  <span className="text-xs text-red-500 font-medium">🔥 Hot!</span>
                )}
                {name.trend === 'new' && (
                  <span className="text-xs text-yellow-500 font-medium">✨ New!</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default RankingList;