import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FlashcardDeck } from "@/contexts/UserContext";
import { ChevronLeft, ChevronRight, RotateCcw, Crown } from "lucide-react";
import '@/styles/flashcard.css';
import { toast } from 'sonner';

interface FlashcardStudyProps {
  deck: FlashcardDeck;
  onUpdateProgress: (cardId: string, mastered: boolean) => void;
  onClose: () => void;
}

export function FlashcardStudy({ deck, onUpdateProgress, onClose }: FlashcardStudyProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set());

  const currentCard = deck.cards[currentIndex];
  const progress = (studiedCards.size / deck.cards.length) * 100;

  const handleNext = () => {
    if (currentIndex < deck.cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      toast('You\'ve reached the end of the deck!');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!studiedCards.has(currentCard.id)) {
      setStudiedCards(prev => new Set([...prev, currentCard.id]));
    }
  };

  const handleMastered = () => {
    onUpdateProgress(currentCard.id, true);
    toast.success('Card marked as mastered!');
    handleNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{deck.title}</h2>
          <p className="text-muted-foreground">
            Card {currentIndex + 1} of {deck.cards.length}
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

      <Progress value={progress} className="w-full" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="relative h-[400px] cursor-pointer perspective-1000" onClick={handleFlip}>
          <CardContent className={`absolute w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            <div className="absolute w-full h-full backface-hidden p-6 flex items-center justify-center text-center">
              <div>
                <h3 className="text-xl font-medium mb-2">Question</h3>
                <p className="text-lg">{currentCard.front}</p>
              </div>
            </div>
            <div className="absolute w-full h-full backface-hidden rotate-y-180 p-6 flex items-center justify-center text-center bg-muted">
              <div>
                <h3 className="text-xl font-medium mb-2">Answer</h3>
                <p className="text-lg">{currentCard.back}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-secondary/20">
            <h3 className="font-medium mb-2">Study Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Click the card to reveal the answer</li>
              <li>• Use arrow keys or buttons to navigate</li>
              <li>• Mark cards as mastered when you know them well</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button
                variant="outline"
                onClick={handleNext}
                disabled={currentIndex === deck.cards.length - 1}
                className="flex-1"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={handleFlip}
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Flip Card
            </Button>

            <Button
              variant="default"
              onClick={handleMastered}
              className="w-full bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600"
              disabled={currentCard.mastered}
            >
              <Crown className="h-4 w-4 mr-2" />
              {currentCard.mastered ? 'Already Mastered' : 'Mark as Mastered'}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              {deck.cards.filter(c => c.mastered).length} of {deck.cards.length} cards mastered
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
