import React, { useState } from 'react';
import { Bot } from 'lucide-react';

interface NameInputProps {
  onSubmit: (name: string) => void;
}

const NameInput: React.FC<NameInputProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="absolute top-6 right-6">
      <div className="flex items-center gap-2">
        <Bot className="w-6 h-6 text-indigo-600" />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Suggest a name..."
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          maxLength={30}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default NameInput;