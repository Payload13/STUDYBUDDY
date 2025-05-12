import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { DeckGrid } from "@/components/flashcards/DeckGrid";
import { FlashcardStudy } from "@/components/flashcards/FlashcardStudy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Upload, FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { FlashcardDeck } from "@/contexts/UserContext";
import { generateFlashcardsFromText, readFileContent } from "@/lib/flashcardGeneration";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface FileTypeMap {
  [key: string]: string;
}

export default function Flashcards() {
  const { user, addFlashcardDeck, updateFlashcardDeck } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<FlashcardDeck | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState("");
  const [newDeckSubject, setNewDeckSubject] = useState("");
  
  const acceptedFileTypes: FileTypeMap = {
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/msword': '.doc',
    'text/plain': '.txt'
  };

  const acceptedExtensions = Object.values(acceptedFileTypes).join(',');
  
  const filteredDecks = searchQuery && user?.flashcardDecks 
    ? user.flashcardDecks.filter(deck => 
        deck.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        deck.subject?.toLowerCase().includes(searchQuery.toLowerCase()))
    : user?.flashcardDecks ?? [];
  
  const handleDeckSelect = (deck: FlashcardDeck) => {
    setSelectedDeck(deck);
  };

  const handleUpdateProgress = (cardId: string, mastered: boolean) => {
    if (!selectedDeck) return;

    const updatedCards = selectedDeck.cards.map(card => 
      card.id === cardId ? { ...card, mastered } : card
    );

    const updatedDeck = {
      ...selectedDeck,
      cards: updatedCards,
      lastStudied: new Date().toISOString()
    };

    updateFlashcardDeck(selectedDeck.id, updatedDeck);
    setSelectedDeck(updatedDeck);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const validFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      if (Object.keys(acceptedFileTypes).includes(file.type)) {
        validFiles.push(file);
      } else {
        toast.error(`File type not supported: ${file.name}`);
      }
    });
    
    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) added successfully`);
    }
  };

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  const generateFlashcards = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to generate flashcards");
      return;
    }

    if (!newDeckTitle) {
      toast.error("Please enter a title for your deck");
      return;
    }
    
    try {
      toast.loading("Processing your files to create flashcards...");

      // Read and process each file
      const allCards = [];
      for (const file of selectedFiles) {
        const content = await readFileContent(file);
        const cards = await generateFlashcardsFromText(content);
        allCards.push(...cards);
      }

      // Create the new deck
      const newDeck: Omit<FlashcardDeck, 'id'> = {
        title: newDeckTitle,
        description: `Generated from ${selectedFiles.map(f => f.name).join(", ")}`,
        cardCount: allCards.length,
        masteredCount: 0,
        lastStudied: new Date().toISOString(),
        subject: newDeckSubject || "General",
        color: "#" + Math.floor(Math.random()*16777215).toString(16),
        cards: allCards
      };
      
      addFlashcardDeck(newDeck);
      toast.dismiss();
      toast.success("Flashcards created successfully!");
      clearFiles();
      setNewDeckTitle("");
      setNewDeckSubject("");
      setIsCreating(false);
    } catch (error) {
      toast.dismiss();
      toast.error("Error generating flashcards. Please try again.");
    }
  };

  // If a deck is selected, show the study view
  if (selectedDeck) {
    return (
      <AppLayout username={user?.name.split(" ")[0]}>
        <FlashcardStudy 
          deck={selectedDeck} 
          onUpdateProgress={handleUpdateProgress}
          onClose={() => setSelectedDeck(null)}
        />
      </AppLayout>
    );
  }

  const handleCreateNew = () => {
    setNewDeckTitle("");
    setNewDeckSubject("");
    setIsCreating(true);
  };

  return (
    <AppLayout username={user?.name.split(" ")[0]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Flashcards</h1>
            <p className="text-muted-foreground">
              Review and manage your flashcard decks
            </p>
          </div>
          
          <div className="w-full sm:w-auto flex gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search decks..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateNew}>New Deck</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Deck</DialogTitle>
                  <DialogDescription>
                    Create a new deck by uploading files or entering cards manually.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="deck-title">Deck Title</Label>
                    <Input 
                      id="deck-title"
                      value={newDeckTitle}
                      onChange={(e) => setNewDeckTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deck-subject">Subject (optional)</Label>
                    <Input 
                      id="deck-subject"
                      value={newDeckSubject}
                      onChange={(e) => setNewDeckSubject(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                  <Button onClick={generateFlashcards}>Create Deck</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Tabs defaultValue="my-decks" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="my-decks">My Decks</TabsTrigger>
            <TabsTrigger value="create">Create Deck</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-decks" className="mt-6">
            <DeckGrid 
              decks={filteredDecks} 
              onSelectDeck={handleDeckSelect}
              onCreateDeck={handleCreateNew}
            />
          </TabsContent>
          
          <TabsContent value="create" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <Card className="lg:col-span-3 frosted-card">
                <CardHeader>
                  <h3 className="text-lg font-medium">Upload Files</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your documents or select files to generate flashcards
                  </p>
                </CardHeader>
                
                <CardContent>
                  {/* File Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
                    }`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Drop files here or click to browse</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Supports PDF, Word documents (.doc, .docx), PowerPoint presentations (.ppt, .pptx), and text files
                    </p>
                    <Input
                      type="file"
                      className="hidden"
                      id="flashcard-file-upload"
                      multiple
                      accept={acceptedExtensions}
                      onChange={handleChange}
                    />
                    <Button
                      onClick={() => document.getElementById("flashcard-file-upload")?.click()}
                      variant="outline"
                      className="mx-auto"
                    >
                      Select Files
                    </Button>
                  </div>
                  
                  {/* Selected Files */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Selected Files ({selectedFiles.length})</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center p-2 bg-secondary/20 rounded">
                            <FileText className="h-4 w-4 mr-2" />
                            <span className="flex-1 text-sm truncate">{file.name}</span>
                            <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="outline" size="sm" onClick={clearFiles}>
                          Clear All
                        </Button>
                        <Button size="sm" onClick={generateFlashcards}>
                          Generate Flashcards
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2 frosted-card">
                <CardHeader>
                  <h3 className="text-lg font-medium">Tips for Great Flashcards</h3>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">📄 Supported File Types</h4>
                      <p className="text-sm text-muted-foreground">PDF, Word (.doc, .docx), PowerPoint (.ppt, .pptx), and Text files</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">🧠 Best for Learning</h4>
                      <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                        <li>Lecture notes with key terms and definitions</li>
                        <li>Vocabulary lists with translations or meanings</li>
                        <li>Study guides with questions and answers</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">✨ How It Works</h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI will extract key concepts, terms, and definitions from your documents and create flashcards with questions on one side and answers on the other
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
