import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Battery, Leaf, TrendingUp } from "lucide-react";
import heroImage from "@/assets/ev-hero.jpg";
import chargingImage from "@/assets/ev-charging.jpg";

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: "Electric Power",
      description: "Leading the charge in sustainable transportation with cutting-edge EV technology.",
    },
    {
      icon: Battery,
      title: "Advanced Battery Tech",
      description: "Next-generation battery systems for longer range and faster charging.",
    },
    {
      icon: Leaf,
      title: "Zero Emissions",
      description: "100% electric vehicles for a cleaner, greener planet.",
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description: "Data-driven insights to optimize your EV fleet and charging infrastructure.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="container relative z-10 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">Driving the Future with Innovation</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Powering Tomorrow's
              </span>
              <br />
              <span className="text-foreground">Electric Revolution</span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Leading the transition to sustainable transportation through innovative electric vehicles,
              smart charging infrastructure, and AI-powered fleet management.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/analytics">
                <Button size="lg" className="group shadow-lg">
                  Explore Analytics
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/chatbot">
                <Button size="lg" variant="outline" className="shadow-lg">
                  Talk to AI Assistant
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At EV Innovate, we're committed to accelerating the world's transition to sustainable energy.
              Our mission is to make electric vehicles accessible, affordable, and efficient for everyone,
              while leveraging cutting-edge AI technology to optimize charging networks and predict future
              energy demands.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Through data-driven insights and intelligent forecasting, we're building the infrastructure
              for a zero-emission future—one charge at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose EV Innovate</h2>
            <p className="text-lg text-muted-foreground">
              Leading innovation in electric mobility and sustainable energy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${chargingImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-sm" />
            </div>

            <div className="relative z-10 px-8 py-20 sm:px-16 sm:py-32 text-center">
              <h2 className="text-3xl sm:text-5xl font-bold text-primary-foreground mb-6">
                Ready to Go Electric?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses already leveraging our AI-powered analytics
                and forecasting tools to optimize their EV operations.
              </p>
              <Link to="/analytics">
                <Button size="lg" variant="secondary" className="shadow-xl">
                  Get Started Today
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted/30 border-t border-border">
        <div className="container px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 EV Innovate – Powered by Sustainable AI ⚡
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
