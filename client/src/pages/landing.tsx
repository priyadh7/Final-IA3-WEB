import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, PieChart, Wallet, BarChart3, Shield, Smartphone, Zap, ArrowRight, Sparkles, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Animated Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="border-b h-16 flex items-center px-4 md:px-6 lg:px-8 bg-background/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              WealthWatch
            </span>
          </motion.div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" data-testid="button-login">Login</Button>
            </Link>
            <Link href="/register">
              <Button data-testid="button-get-started" className="group">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section with Animations */}
      <section className="min-h-[80vh] flex items-center px-4 md:px-6 lg:px-8 py-20 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ duration: 7, repeat: Infinity }}
            className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Smart Financial Management</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Take Control of Your{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Financial Future
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl">
              Track expenses, set budgets, and gain insights into your spending habits. 
              Make smarter financial decisions with powerful analytics and beautiful visualizations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto group" data-testid="button-hero-start">
                  <Zap className="mr-2 w-4 h-4 group-hover:animate-pulse" />
                  Start Tracking Free
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-hero-login">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats Row */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-8 pt-4"
            >
              <div>
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
              <div>
                <p className="text-3xl font-bold">₹2M+</p>
                <p className="text-sm text-muted-foreground">Tracked</p>
              </div>
              <div>
                <p className="text-3xl font-bold">4.9/5</p>
                <p className="text-sm text-muted-foreground">Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Animated Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20 shadow-2xl"
            >
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-between p-6 bg-card rounded-xl border shadow-lg"
                >
                  <div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <IndianRupee className="w-4 h-4" />
                      Total Spent This Month
                    </p>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-3xl font-bold font-mono bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                    >
                      ₹2,847.50
                    </motion.p>
                    <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      12% less than last month
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/50 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </motion.div>
                </motion.div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Food & Dining", amount: "₹523", color: "from-orange-500 to-orange-600" },
                    { label: "Transport", amount: "₹215", color: "from-blue-500 to-blue-600" },
                    { label: "Shopping", amount: "₹892", color: "from-purple-500 to-purple-600" },
                    { label: "Entertainment", amount: "₹341", color: "from-pink-500 to-pink-600" }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="p-4 bg-card rounded-xl border shadow-md hover:shadow-lg transition-all"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} mb-2`} />
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-xl font-bold font-mono">{item.amount}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Animations */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Manage Your Money
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you understand and control your spending
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Smart Analytics",
                description: "Visualize your spending patterns with interactive charts and detailed breakdowns by category.",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: PieChart,
                title: "Budget Tracking",
                description: "Set monthly budgets for each category and get alerts when you're approaching your limits.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Shield,
                title: "Secure & Private",
                description: "Your financial data is encrypted and secure. We never share your information with third parties.",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Smartphone,
                title: "Mobile Friendly",
                description: "Access your expenses anywhere, anytime. Fully responsive design works on all devices.",
                gradient: "from-orange-500 to-red-500"
              },
              {
                icon: TrendingUp,
                title: "Insights & Trends",
                description: "Discover spending trends and patterns to help you make better financial decisions.",
                gradient: "from-indigo-500 to-blue-500"
              },
              {
                icon: Wallet,
                title: "Easy Tracking",
                description: "Add expenses in seconds with our streamlined interface. Tag and categorize with ease.",
                gradient: "from-pink-500 to-rose-500"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-all hover:shadow-xl">
                  <CardContent className="p-6 space-y-4">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: "10,000+", label: "Active Users" },
              { value: "₹2M+", label: "Money Tracked" },
              { value: "50K+", label: "Expenses Logged" },
              { value: "4.9/5", label: "User Rating" }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: "spring" }}
                className="text-center"
              >
                <motion.p 
                  whileHover={{ scale: 1.1 }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-6 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 blur-3xl -z-10" />
          
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block"
          >
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-bold">
            Ready to Take{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Control?
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of users who are already managing their finances smarter with WealthWatch
          </p>
          
          <Link href="/register">
            <Button size="lg" className="group text-lg px-8 py-6" data-testid="button-final-cta">
              <Zap className="mr-2 w-5 h-5 group-hover:animate-pulse" />
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <p className="text-sm text-muted-foreground">
            No credit card required • Free forever • 2 minute setup
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 md:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/50 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">WealthWatch</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Smart financial management for everyone
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 WealthWatch. All rights reserved. Built with MongoDB & React.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
