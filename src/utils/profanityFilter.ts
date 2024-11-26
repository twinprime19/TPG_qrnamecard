import Filter from 'bad-words';

const englishFilter = new Filter();

// Simple Vietnamese profanity filter
const vietnameseProfanityList = [
  'dm', 'dmm', 'đmm', 'đm', 'vcl', 'vl', 'đcm', 'dcm',
  'dit', 'đit', 'đụ', 'du', 'duma', 'đuma', 'đm',
  'cc', 'cặc', 'lon', 'lồn', 'buoi', 'buồi',
  'cave', 'đĩ', 'di', 'ngu', 'ngốc'
];

const containsVietnameseProfanity = (text: string): boolean => {
  const normalizedText = text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  
  return vietnameseProfanityList.some(word => 
    normalizedText.includes(word.toLowerCase())
  );
};

export const containsProfanity = (text: string): boolean => {
  return englishFilter.isProfane(text) || containsVietnameseProfanity(text);
};