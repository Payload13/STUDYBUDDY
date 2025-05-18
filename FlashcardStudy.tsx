import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  FlashcardWithMetadata, 
  Difficulty, 
  processReview, 
  getDueCards 
} from '@/lib/spaced-repetition';

interface FlashcardStudyProps {
  deck: FlashcardWithMetadata[];
  onUpdateDeck: (updatedDeck: FlashcardWithMetadata[]) => void;
  onClose: () => void;
}

export function FlashcardStudy({ deck, onUpdateDeck, onClose }: FlashcardStudyProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [dueCards, setDueCards] = useState<FlashcardWithMetadata[]>([]);
  const [studyComplete, setStudyComplete] = useState(false);

  useEffect(() => {
    const due = getDueCards(deck);
    setDueCards(due);
    setStudyComplete(due.length === 0);
  }, [deck]);

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleDifficultyResponse = (difficulty: Difficulty) => {
    const currentCard = dueCards[currentCardIndex];
    const updatedCard = processReview(currentCard, difficulty);
    
    // Update the deck with the new card metadata
    const updatedDeck = deck.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    );
    onUpdateDeck(updatedDeck);

    // Move to next card
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setStudyComplete(true);
    }
  };

  if (studyComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <h3 className="text-2xl font-light mb-4">Study Session Complete!</h3>
        <p className="text-black/60 mb-8">
          You've reviewed all cards due for today. Come back tomorrow for more!
        </p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-black hover:bg-black/90 text-white font-light px-8 py-6 rounded-full"
        >
          Review Again
        </Button>
      </div>
    );
  }

  const currentCard = dueCards[currentCardIndex];

  if (!currentCard) return null;

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <div className="w-full max-w-2xl aspect-[3/2] perspective-1000">
        <motion.div
          className={`relative w-full h-full transform-style-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Front of card */}
          <div className="absolute inset-0 backface-hidden bg-white border border-black/10 rounded-xl p-8 flex items-center justify-center text-center">
            <p className="text-xl font-light">{currentCard.front}</p>
          </div>

          {/* Back of card */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border border-black/10 rounded-xl p-8 flex items-center justify-center text-center">
            <p className="text-xl font-light">{currentCard.back}</p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex gap-4"
          >
            <Button
              onClick={() => handleDifficultyResponse('hard')}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-600 font-light px-6 py-2 rounded-full"
            >
              Hard
            </Button>
            <Button
              onClick={() => handleDifficultyResponse('medium')}
              className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 font-light px-6 py-2 rounded-full"
            >
              Medium
            </Button>
            <Button
              onClick={() => handleDifficultyResponse('easy')}
              className="bg-green-500/10 hover:bg-green-500/20 text-green-600 font-light px-6 py-2 rounded-full"
            >
              Easy
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-sm text-black/40 font-light">
        Card {currentCardIndex + 1} of {dueCards.length}
      </div>
    </div>
  );
}
