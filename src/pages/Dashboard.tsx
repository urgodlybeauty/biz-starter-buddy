import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Building, 
  Shield, 
  CreditCard, 
  User, 
  LogOut,
  Printer,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, loading, signOut, isGuest } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user && !isGuest) {
    return <Navigate to="/auth" replace />;
  }

  const modules = [
    {
      id: 'ein',
      title: 'EIN Application',
      description: 'Get your Federal Tax ID number for free through the IRS',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      path: '/ein-application',
      completed: false
    },
    {
      id: 'llc',
      title: 'LLC Formation',
      description: 'Form your LLC directly with your state - save on fees',
      icon: Building,
      color: 'from-purple-500 to-purple-600',
      path: '/llc-application',
      completed: false
    },
    {
      id: 'licenses',
      title: 'Business Licenses',
      description: 'Find required licenses and permits for your business type',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      path: '/business-licenses',
      completed: false
    },
    {
      id: 'banking',
      title: 'Business Banking',
      description: 'Find the best business bank accounts in your area',
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600',
      path: '/business-banking',
      completed: false
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Business Suite</h1>
                <p className="text-white/80">Your business setup journey</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isGuest ? (
                <div className="flex items-center space-x-2 text-white/80">
                  <User className="h-4 w-4" />
                  <span>Guest Mode</span>
                </div>
              ) : (
                <div className="text-white/80">
                  Welcome, {user?.user_metadata?.full_name || user?.email}
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isGuest ? 'Exit Guest' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Let's Get Your Business Started
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Follow these four essential steps to legally establish your business. 
            Each module guides you through the process with plain English explanations 
            and helps you file directly with government agencies for free.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {modules.map((module, index) => (
            <Card key={module.id} className="shadow-medium hover:shadow-strong transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${module.color} shadow-medium`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Step {index + 1}
                    </span>
                    {module.completed && (
                      <CheckCircle className="h-5 w-5 text-brand-success" />
                    )}
                  </div>
                </div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <CardDescription className="text-base">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={module.path}>
                  <Button className="w-full group-hover:translate-x-1 transition-transform">
                    Start Module
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                No Hidden Fees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We guide you to file directly with government agencies. 
                No expensive third-party services required.
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Printer className="mr-2 h-5 w-5 text-primary" />
                Printable Forms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate printer-friendly versions of all your 
                completed forms and applications.
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Shield className="mr-2 h-5 w-5 text-primary" />
                Secure & Private
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your business information is encrypted and secure. 
                {isGuest ? ' Sign up to save your progress.' : ' Data is saved to your account.'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Get Started CTA */}
        {isGuest && (
          <Card className="mt-8 gradient-secondary shadow-medium">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Save Your Progress
                </h3>
                <p className="text-white/80 mb-4">
                  Create an account to save your business information and access it anytime.
                </p>
                <Link to="/auth">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;