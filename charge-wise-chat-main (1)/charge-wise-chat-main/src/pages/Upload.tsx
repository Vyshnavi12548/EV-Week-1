import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, FileSpreadsheet, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Upload = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name);
    setUploading(true);
    
    toast({
      title: "File Uploaded",
      description: `Processing ${file.name}...`,
    });

    const reader = new FileReader();
    
    reader.onerror = () => {
      console.error('File reading error');
      toast({
        title: "Error",
        description: "Failed to read file. Please try again.",
        variant: "destructive",
      });
      setUploading(false);
    };
    
    reader.onload = async (e) => {
      try {
        console.log('File loaded, processing...');
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',');
        
        console.log(`Parsed ${lines.length - 1} rows with ${headers.length} columns`);
        
        // Upload to Supabase Storage
        const fileName = `dataset_${Date.now()}.csv`;
        const { error: uploadError } = await supabase.storage
          .from('datasets')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        console.log('File uploaded to storage:', fileName);
        
        toast({
          title: "Dataset Loaded Successfully!",
          description: `${lines.length - 1} rows uploaded. Redirecting...`,
          duration: 1500,
        });
        
        // Store dataset info in localStorage (with first 100 rows as context)
        const contextData = lines.slice(0, 100).join('\n');
        localStorage.setItem('datasetLoaded', 'true');
        localStorage.setItem('datasetName', file.name);
        localStorage.setItem('datasetRows', String(lines.length - 1));
        localStorage.setItem('datasetContext', contextData);
        localStorage.setItem('datasetFileName', fileName);
        
        console.log('Redirecting to chatbot in 1.5 seconds...');
        
        // Redirect to chatbot
        setTimeout(() => {
          console.log('Navigating to /chatbot');
          navigate('/chatbot');
        }, 1500);
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: "Error",
          description: "Failed to upload dataset. Please try again.",
          variant: "destructive",
        });
        setUploading(false);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Upload Your Dataset
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Upload your EV data to analyze and chat with AI about your dataset
            </p>
          </div>

          {/* Upload Card */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Dataset Upload
              </CardTitle>
              <CardDescription>
                Supported formats: CSV, Excel (.xlsx, .xls)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <UploadIcon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Choose your file</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload CSV or Excel file containing your EV data
                    </p>
                  </div>
                  <label htmlFor="file-upload">
                    <Button 
                      className="cursor-pointer gap-2" 
                      size="lg"
                      disabled={uploading}
                    >
                      {uploading ? "Processing..." : "Select File"}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>

              {/* Info */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm">What happens next?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your dataset will be analyzed</li>
                  <li>• AI chatbot will learn from your data</li>
                  <li>• You can ask questions about your EV data</li>
                  <li>• Get insights and predictions</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Back to Analytics */}
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/analytics')}
            >
              Back to Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
