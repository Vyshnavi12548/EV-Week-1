import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, TrendingUp, Battery, Zap, Activity } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

const Analytics = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [hasData, setHasData] = useState(false);

  // Sample data for visualization
  const salesData = [
    { month: "Jan", sales: 4500, forecast: 4800 },
    { month: "Feb", sales: 5200, forecast: 5400 },
    { month: "Mar", sales: 6100, forecast: 6300 },
    { month: "Apr", sales: 5800, forecast: 6800 },
    { month: "May", sales: 7200, forecast: 7500 },
    { month: "Jun", sales: 8100, forecast: 8400 },
  ];

  const chargingData = [
    { station: "Station A", usage: 850 },
    { station: "Station B", usage: 720 },
    { station: "Station C", usage: 940 },
    { station: "Station D", usage: 680 },
  ];

  const batteryData = [
    { name: "Excellent (90-100%)", value: 45, color: "hsl(145, 100%, 39%)" },
    { name: "Good (70-89%)", value: 35, color: "hsl(207, 76%, 51%)" },
    { name: "Fair (50-69%)", value: 15, color: "hsl(40, 90%, 60%)" },
    { name: "Low (<50%)", value: 5, color: "hsl(0, 84%, 60%)" },
  ];

  const metrics = [
    { label: "Total Sales", value: "8,100", change: "+12.5%", icon: TrendingUp, color: "text-primary" },
    { label: "Active Vehicles", value: "2,450", change: "+8.2%", icon: Zap, color: "text-secondary" },
    { label: "Avg Battery Health", value: "87%", change: "+2.1%", icon: Battery, color: "text-green-500" },
    { label: "Charging Sessions", value: "15.2K", change: "+18.9%", icon: Activity, color: "text-blue-500" },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast({
      title: "File Uploaded",
      description: `Analyzing ${file.name}...`,
    });

    // Read and parse the file
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        
        // Simple CSV parsing (for demo - in production use a proper CSV parser)
        const lines = content.split('\n');
        const headers = lines[0].split(',');
        
        toast({
          title: "Analysis Complete",
          description: `Loaded ${lines.length - 1} rows with ${headers.length} columns. You can now ask the chatbot about this data.`,
        });
        
        setHasData(true);
        
        // Redirect to chatbot after brief delay
        setTimeout(() => {
          window.location.href = '/chatbot';
        }, 2000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to parse file. Please upload a valid CSV file.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Data Analytics & Forecasting
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your EV data to generate insights, visualizations, and AI-powered predictions
            </p>
          </div>

          {/* Upload Section */}
          <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Upload Your Dataset</h3>
                  <p className="text-sm text-muted-foreground">
                    Support for CSV, Excel files (Sales, Battery, Charging data)
                  </p>
                </div>
                <Button onClick={() => navigate('/upload')}>
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{metric.label}</span>
                      <Icon className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-xs text-green-500 font-medium">{metric.change}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales & Forecast Chart */}
            <Card>
              <CardHeader>
                <CardTitle>EV Sales & Forecast</CardTitle>
                <CardDescription>Monthly sales with AI-powered predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="hsl(145, 100%, 39%)" strokeWidth={3} name="Actual Sales" />
                    <Line type="monotone" dataKey="forecast" stroke="hsl(207, 76%, 51%)" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Charging Station Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Charging Station Usage</CardTitle>
                <CardDescription>Daily charging sessions by station</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chargingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="station" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="usage" fill="hsl(207, 76%, 51%)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Battery Health Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Fleet Battery Health</CardTitle>
                <CardDescription>Distribution of battery conditions across fleet</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={batteryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {batteryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Insights Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>Key predictions and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <p className="text-sm"><strong>Sales Forecast:</strong> Expected 8,400 sales next month (+3.7% growth)</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
                    <p className="text-sm"><strong>Peak Demand:</strong> Station C will require capacity upgrade by Q3</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                    <p className="text-sm"><strong>Battery Health:</strong> 80% of fleet maintains excellent condition</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    <p className="text-sm"><strong>Optimization:</strong> Implement dynamic pricing during off-peak hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
