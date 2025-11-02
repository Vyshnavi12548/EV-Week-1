import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chatbot = () => {
  const { toast } = useToast();
  
  // Check if dataset was loaded
  const datasetLoaded = localStorage.getItem('datasetLoaded');
  const datasetName = localStorage.getItem('datasetName');
  const datasetRows = localStorage.getItem('datasetRows');

  const initialMessage = datasetLoaded && datasetName
    ? `Welcome! I see you've uploaded "${datasetName}" with ${datasetRows} rows of EV data. I'm ready to answer your questions about this dataset. What would you like to know? 🚗⚡`
    : "Hello! I'm your EV AI Assistant. Upload a dataset to get started, or ask me general questions about electric vehicles! ⚡";

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: initialMessage,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get dataset context from localStorage
      const datasetContext = localStorage.getItem('datasetContext');
      
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: { 
          message: input,
          datasetContext: datasetContext || null
        }
      });

      if (error) throw error;

      const assistantMessage: Message = { 
        role: "assistant", 
        content: data.reply || "I apologize, but I couldn't generate a response. Please try again."
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
        variant: "destructive",
      });
      
      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = datasetLoaded 
    ? [
        "What are the top 5 EVs by range in the dataset?",
        "Which cars have the fastest 0-100 acceleration?",
        "Compare battery sizes across different models",
        "Show me the most efficient EVs",
      ]
    : [
        "What's the EV market forecast for 2025?",
        "How can I optimize charging costs?",
        "Tell me about battery maintenance",
        "What are the latest EV trends?",
      ];

  return (
    <div className="min-h-screen pt-24 pb-8 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 sm:px-6 lg:px-8 h-full">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EV AI Assistant
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Ask me anything about electric vehicles, forecasting, and sustainability
            </p>
            
            {/* Upload Dataset Button */}
            {!datasetLoaded && (
              <Link to="/upload">
                <Button className="gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Dataset to Get Started
                </Button>
              </Link>
            )}
            
            {datasetLoaded && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span>📊 Dataset: {datasetName}</span>
                <span>•</span>
                <span>{datasetRows} rows</span>
                <span>•</span>
                <Link to="/upload" className="text-primary hover:underline">
                  Upload New
                </Link>
              </div>
            )}
          </div>

          {/* Chat Card */}
          <Card className="shadow-xl">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span>Chat</span>
                  </CardTitle>
                  <CardDescription>Powered by AI - Real-time insights and predictions</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-muted-foreground">Online</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {/* Messages Container */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 ${
                      message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-secondary/20 to-secondary/30"
                          : "bg-gradient-to-br from-primary/20 to-primary/30"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-5 h-5 text-secondary" />
                      ) : (
                        <Bot className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div
                      className={`flex-1 px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-secondary/10 to-secondary/5 ml-12"
                          : "bg-gradient-to-br from-primary/10 to-primary/5 mr-12"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/30">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 mr-12">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions */}
              {messages.length === 1 && (
                <div className="px-6 pb-4 space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">Suggested questions:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="justify-start text-left h-auto py-2 px-3"
                        onClick={() => setInput(question)}
                      >
                        <span className="text-xs line-clamp-1">{question}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about EV trends, forecasting, sustainability..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  AI responses are for informational purposes. Connect Lovable Cloud for real AI integration.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-primary mt-1" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">✅ AI-Powered Chatbot Active</p>
                  <p className="text-xs text-muted-foreground">
                    Connected to Hugging Face Blenderbot for conversational AI responses about
                    electric vehicles, forecasting, and sustainability trends.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
