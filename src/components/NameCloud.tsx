import React from 'react';
import { TagCloud } from 'react-tagcloud';
import { BotName } from '../types';

interface NameCloudProps {
  names: BotName[];
  onVote: (id: string) => void;
}

const NameCloud: React.FC<NameCloudProps> = ({ names, onVote }) => {
  const data = names.map(name => ({
    value: name.text,
    count: name.votes,
    key: name.id
  }));

  return (
    <div className="w-[600px] h-[600px] flex items-center justify-center">
      <TagCloud
        minSize={24}
        maxSize={72}
        tags={data}
        onClick={(tag: any) => {
          const name = names.find(n => n.text === tag.value);
          if (name) onVote(name.id);
        }}
        className="cursor-pointer"
        renderer={(tag: any, size: number, color: string) => (
          <span
            key={tag.key}
            className="inline-block m-2 transition-all duration-300 hover:scale-110 hover:text-indigo-600"
            style={{
              fontSize: `${size}px`,
              color: `hsl(${(tag.count * 60) % 360}, 70%, 50%)`,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {tag.value}
          </span>
        )}
      />
    </div>
  );
};

export default NameCloud;