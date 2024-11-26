import { useCallback } from 'react';

const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

export const useSound = () => {
  const playPopSound = useCallback((frequency: number = 1000) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.15);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15);
  }, []);

  const playVoteSound = useCallback(() => {
    // Play a sequence of ascending notes
    setTimeout(() => playPopSound(523.25), 0);   // C5
    setTimeout(() => playPopSound(659.25), 50);  // E5
    setTimeout(() => playPopSound(783.99), 100); // G5
  }, [playPopSound]);

  return { playVoteSound };
};