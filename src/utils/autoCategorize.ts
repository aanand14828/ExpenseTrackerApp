// src/utils/autoCategorize.ts
export function autoCategorize(note: string, categories: { income: string[], expense: string[] }) {
    const lowerNote = note.toLowerCase();
    // Simple logic: if note includes certain keywords
    if (lowerNote.includes('rent')) return 'Rent';
    if (lowerNote.includes('food') || lowerNote.includes('restaurant')) return 'Food';
    if (lowerNote.includes('uber') || lowerNote.includes('taxi') || lowerNote.includes('bus')) return 'Transport';
  
    // If no match, return empty or fallback. Could also pick the most used category historically.
    return '';
  }