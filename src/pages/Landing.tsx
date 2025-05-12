import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, BookOpen, Users, Brain, Calendar, Bell, ChartBar } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#2A2F3C] text-white">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] -left-40 top-1/4 opacity-20 bg-gradient-to-r from-purple-600/30 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-[600px] h-[600px] right-0 bottom-0 opacity-20 bg-gradient-to-l from-orange-600/30 to-transparent rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-purple-400">
                Your Smart, Simple Study Companion
              </h1>
              <p className="text-xl text-gray-300">
                Turn your notes into flashcards, quizzes, and a smart timetable — instantly.
              </p>
              <div className="flex gap-4">
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600"
                  >
                    Try Study Buddy Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-black/40 border border-white/20 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Log In
                  </Button>
                </Link>
              </div>
              <div className="flex gap-8 text-sm text-gray-400">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                  You don't pay a penny.
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                  Made for students. Runs offline.
                </span>
              </div>
            </div>
          <div className="lg:w-1/2">
  <div className="aspect-video bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 flex flex-col items-center justify-center p-6">
    <p className="text-2xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
      Developed by
    </p>
    <p className="text-3xl font-bold mt-2 text-white">
      Yorke & Toni
    </p>
  </div>
</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-black/20 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to ace your studies
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
              >
                <feature.icon className="h-8 w-8 mb-4 text-orange-400" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="relative py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            {proofPoints.map((point, index) => (
              <div key={index} className="p-6">
                <h3 className="text-2xl font-bold mb-2">{point.title}</h3>
                <p className="text-gray-400">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="relative bg-black/20 py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <blockquote className="text-2xl font-medium italic mb-4">
            "I used to cram randomly. Now my week's fully planned in Study Buddy."
          </blockquote>
          <cite className="text-gray-400">— Final-year student, KNUST</cite>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to study smarter?</h2>
          <Link to="/register">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: BookOpen,
    title: "PDF-to-Quiz Converter",
    description: "Drop your notes. Get instant quizzes and flashcards."
  },
  {
    icon: Calendar,
    title: "Smart Timetable Calendar",
    description: "Plan, move, and track your study sessions like a pro."
  },
  {
    icon: Brain,
    title: "Quiz Engine (Offline)",
    description: "Adaptive questions built from your notes — no internet needed."
  },
  {
    icon: Bell,
    title: "Study Alerts",
    description: "Get friendly reminders when it's time to grind."
  },
  {
    icon: ChartBar,
    title: "Track Progress",
    description: "Stay on top of what you've done, and what needs more focus."
  },
  {
    icon: Users,
    title: "Study with Friends",
    description: "Share notes, quizzes, and flashcaards with your friends."
  }
];

const proofPoints = [
  {
    title: "Built by students",
    description: "We know what you need. We built it for you."
  },
  {
    title: "Works offline",
    description: "Don't lose a brain cell to Telecel."
  },
  {
    title: "Always free",
    description: " Money? We don't have some either lol."
  }
];