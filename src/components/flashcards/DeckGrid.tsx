import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Clock, Plus, BookOpen } from "lucide-react";
import { FlashcardDeck } from "@/contexts/UserContext";
import { format, formatDistanceToNow } from 'date-fns';

interface DeckGridProps {
  decks: FlashcardDeck[];
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
      {decks.map((deck) => {
        const masteredCount = deck.cards.filter(c => c.mastered).length;
        const progress = (masteredCount / deck.cards.length) * 100;
        const lastStudied = formatLastStudied(deck.lastStudied);

        return (
          <Card 
            key={deck.id} 
            className="frosted-card overflow-hidden cursor-pointer hover:bg-accent/50 transition-colors group"
            onClick={() => onSelectDeck(deck)}
          >
            <div 
              className="h-2 transition-all group-hover:h-3"
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
                  onSelectDeck(deck);
                }}
              >
                Study
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
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
