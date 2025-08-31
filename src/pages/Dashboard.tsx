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
import { BusinessSuiteLayout } from '@/components/BusinessSuiteLayout';

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
      details: 'Complete form preparation with field-by-field guidance and direct IRS links',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      path: '/ein-application',
      completed: false,
      features: ['Form SS-4 preparation', 'Data validation', 'Print-ready format', 'Progress saving']
    },
    {
      id: 'llc',
      title: 'LLC Formation',
      description: 'Form your LLC directly with your state - save on fees',
      details: 'State-specific LLC formation with location-based requirements',
      icon: Building,
      color: 'from-purple-500 to-purple-600',
      path: '/llc-application',
      completed: false,
      features: ['State-specific questions', 'ZIP code detection', 'Filing fee calculator', 'Required documents list']
    },
    {
      id: 'licenses',
      title: 'Business Licenses',
      description: 'Find required licenses and permits for your business type',
      details: 'Industry-specific license finder with government resource links',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      path: '/business-licenses',
      completed: false,
      features: ['12+ business categories', 'State requirements', 'Local permit finder', 'Application links']
    },
    {
      id: 'banking',
      title: 'Business Banking',
      description: 'Find the best business bank accounts in your area',
      details: 'Compare business accounts from major banks with real-time data',
      icon: CreditCard,
      color: 'from-orange-500 to-orange-600',
      path: '/business-banking',
      completed: false,
      features: ['10+ bank options', 'Fee comparison', 'Location-based search', 'Application links']
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <BusinessSuiteLayout>
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
                  <h1 className="text-2xl font-bold text-white">Business Suite Dashboard</h1>
                  <p className="text-white/80">Your complete business setup platform</p>
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
              Complete Business Setup Suite
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mb-6">
              Everything you need to legally establish your business in one comprehensive platform. 
              Our suite guides you through each essential step with expert guidance and connects you 
              directly to official government resources - no expensive third-party services required.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">4</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Core Modules</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">50+</div>
                <div className="text-sm text-green-700 dark:text-green-300">Business Types</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">ALL</div>
                <div className="text-sm text-purple-700 dark:text-purple-300">US States</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">$0</div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Hidden Fees</div>
              </div>
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {modules.map((module, index) => (
              <Card key={module.id} className="shadow-medium hover:shadow-strong transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${module.color} shadow-medium`}>
                      <module.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Module {index + 1}
                      </span>
                      {module.completed && (
                        <CheckCircle className="h-5 w-5 text-brand-success" />
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                  <CardDescription className="text-base mb-3">
                    {module.description}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mb-4">
                    {module.details}
                  </p>
                  
                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">Included Features:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {module.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link to={module.path}>
                    <Button className="w-full group-hover:translate-x-1 transition-transform">
                      Launch {module.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Suite Overview */}
          <Card className="gradient-primary shadow-strong mb-8">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Your Complete Business Formation Platform
              </h3>
              <p className="text-white/90 text-lg mb-6 max-w-3xl mx-auto">
                Join thousands of entrepreneurs who have successfully launched their businesses using our comprehensive suite. 
                From federal tax registration to local permits, we've got every aspect of business formation covered.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
                <div className="flex flex-col items-center">
                  <FileText className="h-8 w-8 mb-2" />
                  <h4 className="font-semibold">Federal Registration</h4>
                  <p className="text-sm text-white/80">EIN application preparation</p>
                </div>
                <div className="flex flex-col items-center">
                  <Building className="h-8 w-8 mb-2" />
                  <h4 className="font-semibold">State Formation</h4>
                  <p className="text-sm text-white/80">LLC setup for all 50 states</p>
                </div>
                <div className="flex flex-col items-center">
                  <Shield className="h-8 w-8 mb-2" />
                  <h4 className="font-semibold">Compliance & Banking</h4>
                  <p className="text-sm text-white/80">Licenses, permits & accounts</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
    </BusinessSuiteLayout>
  );
};

export default Dashboard;