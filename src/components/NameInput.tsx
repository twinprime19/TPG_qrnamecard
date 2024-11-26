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
    <form onSubmit={handleSubmit} className="md:absolute md:top-6 md:right-6 w-full md:w-auto">
      <div className="flex items-center gap-2">
        <Bot className="w-6 h-6 text-indigo-600" />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Suggest a name..."
          className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          maxLength={30}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 whitespace-nowrap"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default NameInput;