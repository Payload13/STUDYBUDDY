
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Clock, Upload, FileText } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

// Mock data
const mockQuizzes = [
  {
    id: "quiz-1",
    title: "World History Midterm",
    description: "Review quiz covering ancient civilizations through the Renaissance",
    questionCount: 25,
    timeLimit: "45 min",
    difficulty: "Medium",
    subject: "History",
    lastTaken: "1 week ago",
    score: "85%"
  },
  {
    id: "quiz-2",
    title: "Biology Cell Functions",
    description: "Test your knowledge of cellular processes and organelles",
    questionCount: 20,
    timeLimit: "30 min",
    difficulty: "Hard",
    subject: "Biology",
    lastTaken: null,
    score: null
  },
  {
    id: "quiz-3",
    title: "Spanish Verb Conjugation",
    description: "Practice quiz on regular and irregular verb forms in Spanish",
    questionCount: 30,
    timeLimit: "40 min",
    difficulty: "Easy",
    subject: "Languages",
    lastTaken: "3 days ago",
    score: "92%"
  }
];

export default function Quizzes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const acceptedFileTypes = [
    "application/pdf", 
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/vnd.ms-powerpoint", // .ppt
    "text/plain"
  ];
  
  const filteredQuizzes = searchQuery 
    ? mockQuizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        quiz.subject?.toLowerCase().includes(searchQuery.toLowerCase()))
    : mockQuizzes;
  
  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Process the files
  const handleFiles = (files: FileList) => {
    const validFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      if (acceptedFileTypes.includes(file.type)) {
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

  // Clear selected files
  const clearFiles = () => {
    setSelectedFiles([]);
  };

  // Generate quiz from files
  const generateQuiz = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to generate a quiz");
      return;
    }
    
    toast.success("Generating quiz from your files...");
    // Here you would implement the actual quiz generation logic
    // This would typically involve sending the files to a backend API
    
    // Reset selected files after processing
    clearFiles();
  };

  return (
    <AppLayout username="Alex">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Quizzes</h1>
            <p className="text-muted-foreground">
              Test your knowledge with interactive quizzes
            </p>
          </div>
          
          <div className="w-full sm:w-auto flex gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search quizzes..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="whitespace-nowrap">
              <Plus className="h-4 w-4 mr-1" /> Create Quiz
            </Button>
          </div>
        </div>

        <Tabs defaultValue="my-quizzes" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2">
            <TabsTrigger value="my-quizzes">My Quizzes</TabsTrigger>
            <TabsTrigger value="create">Create Quiz</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-quizzes" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <Card key={quiz.id} className="frosted-card overflow-hidden card-hover">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-lg">{quiz.title}</h3>
                      <Badge variant="outline">{quiz.difficulty}</Badge>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge variant="secondary">{quiz.subject}</Badge>
                      <span className="text-xs text-muted-foreground">{quiz.questionCount} questions</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {quiz.description}
                    </p>
                    
                    <div className="flex justify-between text-xs">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{quiz.timeLimit}</span>
                      </div>
                      
                      {quiz.lastTaken && (
                        <div className="text-muted-foreground">
                          Last taken: {quiz.lastTaken}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-2 border-t">
                    {quiz.score ? (
                      <div className="text-sm">
                        Best score: <span className="font-medium">{quiz.score}</span>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Not taken yet</div>
                    )}
                    
                    <Button size="sm">Take Quiz</Button>
                  </CardFooter>
                </Card>
              ))}
              
              {filteredQuizzes.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <h3 className="text-xl font-medium mb-2">No Quizzes Found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or create a new quiz</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="create" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <Card className="lg:col-span-3 frosted-card">
                <CardHeader>
                  <h3 className="text-lg font-medium">Upload Files</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your documents or select files to generate a quiz
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
                      id="file-upload"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                      onChange={handleChange}
                    />
                    <Button
                      onClick={() => document.getElementById("file-upload")?.click()}
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
                        <Button size="sm" onClick={generateQuiz}>
                          Generate Quiz
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2 frosted-card">
                <CardHeader>
                  <h3 className="text-lg font-medium">Tips</h3>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">📄 Supported File Types</h4>
                      <p className="text-sm text-muted-foreground">PDF, Word (.doc, .docx), PowerPoint (.ppt, .pptx), and Text files</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">⚡️ Best Practices</h4>
                      <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                        <li>Clear and well-formatted documents work best</li>
                        <li>Try to use documents with clear headings and bullet points</li>
                        <li>Combine multiple documents on the same subject for more comprehensive quizzes</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">🔍 What Happens Next?</h4>
                      <p className="text-sm text-muted-foreground">
                        Our AI will analyze your documents and extract key concepts to create multiple-choice and true/false questions
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
