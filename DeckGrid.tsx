import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, Plus, BookOpen } from "lucide-react";
import { FlashcardDeck } from "@/contexts/UserContext";
import { format, formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getReviewStats } from '@/lib/spaced-repetition';
import type { FlashcardWithMetadata } from '@/lib/spaced-repetition';

interface DeckGridProps {
  decks: {
    id: string;
    title: string;
    description: string;
    cards: FlashcardWithMetadata[];
    lastStudied: string;
    color?: string;
    subject?: string;
  }[];
  onSelectDeck: (deck: FlashcardDeck) => void;
  onCreateDeck: () => void;
}

export function DeckGrid({ decks, onSelectDeck, onCreateDeck }: DeckGridProps) {
  const formatLastStudied = (date: string) => {
    try {
      const d = new Date(date);
      // If it's within the last 7 days, show relative time
      if (Date.now() - d.getTime() < 7 * 24 * 60 * 60 * 1000) {
        return formatDistanceToNow(d, { addSuffix: true });
      }
      // Otherwise show the date
      return format(d, 'MMM d, yyyy');
    } catch (e) {
      return 'Never';
    }
  };

  if (!decks.length) {
    return (
      <div className="text-center py-10">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No Flashcard Decks Yet</h3>
        <p className="text-muted-foreground mb-4">
          Create a new deck or upload files to get started
        </p>
        <Button onClick={onCreateDeck}>Create Deck</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map((deck, index) => {
        const stats = getReviewStats(deck.cards);
        const masteredCount = deck.cards.filter(c => c.masteryLevel === 100).length;
        const progress = (masteredCount / deck.cards.length) * 100;
        const lastStudied = formatLastStudied(deck.lastStudied);

        return (
          <motion.div
            key={deck.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={`/flashcards/${deck.id}`}
              className="block p-6 bg-white border border-black/10 rounded-xl hover:border-black/20 transition-all"
            >
              <div 
                className="h-2 transition-all"
                style={{ backgroundColor: deck.color || "#F9A58B" }}
              />
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{deck.title}</h3>
                    {deck.subject && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">
                        {deck.subject}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium">{deck.cards.length} cards</p>
                    <p className="text-xs text-muted-foreground">
                      {masteredCount} mastered
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {deck.description}
                </p>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                  <div>
                    <div className="text-black/40 font-light">Due Today</div>
                    <div className="text-black font-medium">{stats.dueToday}</div>
                  </div>
                  <div>
                    <div className="text-black/40 font-light">Due Tomorrow</div>
                    <div className="text-black font-medium">{stats.dueTomorrow}</div>
                  </div>
                  <div>
                    <div className="text-black/40 font-light">Total Cards</div>
                    <div className="text-black font-medium">{stats.totalCards}</div>
                  </div>
                  <div>
                    <div className="text-black/40 font-light">Mastered</div>
                    <div className="text-black font-medium">
                      {Math.round(stats.masteryPercentage)}%
                    </div>
                  </div>
                </div>

                {stats.dueToday > 0 && (
                  <div className="mt-4 text-sm text-black/60 font-light">
                    {stats.dueToday} card{stats.dueToday !== 1 ? 's' : ''} ready for review
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {lastStudied === 'Never' ? 'Never studied' : `Last studied ${lastStudied}`}
                  </span>
                </div>
                
                <Button 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    const flashcardDeck: FlashcardDeck = {
                      ...deck,
                      cards: deck.cards.map(card => ({
                        ...card,
                        mastered: card.masteryLevel === 100
                      })),
                      color: deck.color || "#F9A58B",
                      subject: deck.subject || 'Unsorted',
                      cardCount: deck.cards.length,
                      masteredCount: deck.cards.filter(c => c.masteryLevel === 100).length
                    };
                    onSelectDeck(flashcardDeck);
                  }}
                >
                  Study
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </CardFooter>
            </Link>
          </motion.div>
        );
      })}
      
      {/* Create New Deck Card */}
      <Card 
        className="frosted-card h-full flex flex-col justify-center items-center p-6 border-dashed cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={onCreateDeck}
      >
        <Plus className="h-8 w-8 mb-2 text-muted-foreground" />
        <h3 className="font-medium mb-1">Create New Deck</h3>
        <p className="text-sm text-muted-foreground text-center">
          Add a new flashcard deck to your collection
        </p>
      </Card>
    </div>
  );
}
