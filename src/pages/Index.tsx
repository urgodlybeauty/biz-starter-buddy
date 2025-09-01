import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Building2, ArrowRight, CheckCircle, Users, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, loading, isGuest } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user || isGuest) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen gradient-hero">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-8">
                  <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Building2 className="h-12 w-12 text-white" />
                  </div>
                </div>
                
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Start Your Business</span>{' '}
                  <span className="block text-white/90 xl:inline">The Right Way</span>
                </h1>
                
                <p className="mt-3 text-base text-white/80 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Complete guide to legally establishing your business. Get your EIN, form your LLC, 
                  find licenses, and set up banking - all with direct links to government resources.
                </p>
                
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/auth">
                      <Button className="w-full px-8 py-4 text-lg font-medium">
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/auth">
                      <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-medium">
                        Continue as Guest
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Hero Image/Illustration */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <div className="h-56 w-full sm:h-72 md:h-96 lg:w-full lg:h-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center">
            <div className="text-white/60 text-center">
              <Building2 className="h-32 w-32 mx-auto mb-4" />
              <p className="text-lg font-medium">Your Business Journey Starts Here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Complete Solution</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl">
              Everything you need to start your business
            </p>
            <p className="mt-4 max-w-2xl text-xl text-muted-foreground lg:mx-auto">
              No expensive lawyers or filing services. We guide you to free government resources.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md gradient-primary">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-foreground">Free EIN Application</h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    Get your federal tax ID number directly from the IRS at no cost.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md gradient-primary">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-foreground">State LLC Formation</h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    File directly with your state and save hundreds in third-party fees.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md gradient-primary">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-foreground">License & Permit Finder</h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    Discover required licenses for your business type and location.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md gradient-primary">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-foreground">Business Banking</h3>
                  <p className="mt-2 text-base text-muted-foreground">
                    Find the best business bank accounts in your area.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="gradient-secondary">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start your business?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-white/90">
            Join thousands of entrepreneurs who have successfully started their businesses with our guidance.
          </p>
          <Link to="/auth">
            <Button className="mt-8 px-8 py-4 text-lg font-medium">
              Start Your Business Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
