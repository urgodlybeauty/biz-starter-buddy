import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, ArrowLeft, Printer, Save, ExternalLink, MapPin, DollarSign, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BankOption {
  name: string;
  website: string;
  applicationLink: string;
  minDeposit: string;
  monthlyFee: string;
  features: string[];
  rating: number;
  benefits: string;
}

const BusinessBanking = () => {
  const { user, loading, isGuest } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [bankResults, setBankResults] = useState<BankOption[]>([]);

  // Sample bank data - in a real app, this would come from APIs
  const sampleBanks: BankOption[] = [
    {
      name: "Chase Business Complete Banking",
      website: "https://www.chase.com",
      applicationLink: "https://www.chase.com/business/checking/business-complete-checking",
      minDeposit: "$0",
      monthlyFee: "$15 (waivable)",
      features: ["No minimum balance", "100 free transactions", "Mobile banking", "Bill pay"],
      rating: 4.2,
      benefits: "Waive monthly fee with $2,000 average balance or $15,000 in qualifying deposits"
    },
    {
      name: "Bank of America Business Advantage",
      website: "https://www.bankofamerica.com",
      applicationLink: "https://www.bankofamerica.com/smallbusiness/deposits/business-checking-account/",
      minDeposit: "$25",
      monthlyFee: "$16 (waivable)",
      features: ["200 free transactions", "Online banking", "Mobile check deposit", "Overdraft protection"],
      rating: 4.0,
      benefits: "Waive monthly fee with $5,000 minimum daily balance"
    },
    {
      name: "Wells Fargo Simple Business Checking",
      website: "https://www.wellsfargo.com",
      applicationLink: "https://www.wellsfargo.com/biz/checking/simple-business-checking/",
      minDeposit: "$25",
      monthlyFee: "$10",
      features: ["100 free transactions", "Mobile banking", "Business debit card", "Online bill pay"],
      rating: 3.8,
      benefits: "Low monthly fee with basic business banking features"
    },
    {
      name: "Capital One Spark Classic",
      website: "https://www.capitalone.com",
      applicationLink: "https://www.capitalone.com/small-business-bank/checking-accounts/",
      minDeposit: "$0",
      monthlyFee: "$0",
      features: ["No monthly fee", "No minimum balance", "Unlimited transactions", "Mobile banking"],
      rating: 4.5,
      benefits: "Completely free business checking with no hidden fees"
    },
    {
      name: "PNC Business Checking",
      website: "https://www.pnc.com",
      applicationLink: "https://www.pnc.com/en/small-business/banking/checking.html",
      minDeposit: "$100",
      monthlyFee: "$15 (waivable)",
      features: ["150 free transactions", "Mobile banking", "Business credit line access", "Cash management"],
      rating: 4.1,
      benefits: "Waive monthly fee with $500 average balance"
    },
    {
      name: "TD Bank Simple Business",
      website: "https://www.td.com",
      applicationLink: "https://www.td.com/us/en/business-banking/accounts",
      minDeposit: "$0",
      monthlyFee: "$15 (waivable)",
      features: ["150 free transactions", "Mobile banking", "Business debit card", "Overdraft protection"],
      rating: 4.0,
      benefits: "Waive monthly fee with $2,500 minimum daily balance"
    },
    {
      name: "Regions Business Checking",
      website: "https://www.regions.com",
      applicationLink: "https://www.regions.com/business-banking/business-checking",
      minDeposit: "$50",
      monthlyFee: "$14 (waivable)",
      features: ["200 free transactions", "Online banking", "Mobile check deposit", "Business tools"],
      rating: 3.9,
      benefits: "Waive monthly fee with $1,500 average balance"
    },
    {
      name: "US Bank Business Checking",
      website: "https://www.usbank.com",
      applicationLink: "https://www.usbank.com/business-banking/business-checking-account.html",
      minDeposit: "$25",
      monthlyFee: "$15 (waivable)",
      features: ["125 free transactions", "Mobile banking", "Business credit card integration", "Cash management"],
      rating: 4.0,
      benefits: "Waive monthly fee with $1,500 minimum daily balance"
    },
    {
      name: "Huntington Business Checking",
      website: "https://www.huntington.com",
      applicationLink: "https://www.huntington.com/small-business/deposits/business-checking",
      minDeposit: "$0",
      monthlyFee: "$9",
      features: ["200 free transactions", "Mobile banking", "Overdraft protection", "Business toolkit"],
      rating: 4.2,
      benefits: "Low monthly fee with extensive transaction allowance"
    },
    {
      name: "Fifth Third Business Checking",
      website: "https://www.53.com",
      applicationLink: "https://www.53.com/business/bank/checking",
      minDeposit: "$100",
      monthlyFee: "$11",
      features: ["100 free transactions", "Mobile banking", "Business debit card", "Online bill pay"],
      rating: 3.8,
      benefits: "Competitive monthly fee with good transaction allowance"
    }
  ];

  useEffect(() => {
    if (!loading && !user && !isGuest) return;
    
    const loadExistingData = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('banking_options')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error loading banking options:', error);
        return;
      }

      if (data && data.length > 0) {
        const bankingData = data[0];
        setZipCode(bankingData.zip_code || '');
        setBankResults((bankingData.bank_results as unknown as BankOption[]) || []);
      }
    };

    loadExistingData();
  }, [user, loading, isGuest]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user && !isGuest) {
    return <Navigate to="/auth" replace />;
  }

  const searchBanks = async () => {
    if (!zipCode || zipCode.length !== 5) {
      toast({
        title: "Invalid ZIP Code",
        description: "Please enter a valid 5-digit ZIP code.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API call - in a real app, this would call banking APIs or scrape data
    setTimeout(() => {
      // Filter banks based on ZIP code (in reality, this would be more sophisticated)
      const filteredBanks = sampleBanks.slice(0, 10);
      setBankResults(filteredBanks);
      
      toast({
        title: "Banks Found",
        description: `Found ${filteredBanks.length} business banking options in your area.`
      });
      setIsSearching(false);
    }, 2000);
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign up to save your banking options.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('banking_options')
        .upsert({
          user_id: user.id,
          zip_code: zipCode,
          bank_results: bankResults as any
        });

      if (error) throw error;

      toast({
        title: "Banking Options Saved",
        description: "Your banking options have been saved successfully."
      });
    } catch (error) {
      console.error('Error saving banking options:', error);
      toast({
        title: "Error",
        description: "Failed to save banking options. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary shadow-soft print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Business Banking</h1>
                  <p className="text-white/80">Find the best business bank accounts</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <Card className="gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="text-2xl">Business Banking Finder</CardTitle>
              <CardDescription className="text-base">
                Every business needs a dedicated business bank account. We'll help you find the best 
                business banking options in your area, focusing on accounts with low fees and good features 
                for small businesses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Pro Tip:</strong> Many banks waive monthly fees if you maintain a minimum balance 
                  or meet other requirements. Look for accounts with no or low minimum deposits to get started.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Search */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Find Banks in Your Area</CardTitle>
              <CardDescription>Enter your ZIP code to find business banking options near you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="zip_code">ZIP Code *</Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="zip_code"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="Enter your ZIP code"
                      maxLength={5}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={searchBanks}
                    disabled={isSearching || !zipCode}
                    className="w-full sm:w-auto"
                  >
                    {isSearching ? 'Searching...' : 'Find Banks'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bank Results */}
          {bankResults.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Business Banking Options</h2>
                <p className="text-muted-foreground">
                  {bankResults.length} banks found in ZIP code {zipCode}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {bankResults.map((bank, index) => (
                  <Card key={index} className="shadow-medium hover:shadow-strong transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{bank.name}</CardTitle>
                          <div className="flex items-center mt-1 space-x-1">
                            {renderStars(bank.rating)}
                            <span className="text-sm text-muted-foreground ml-2">
                              {bank.rating}/5.0
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(bank.applicationLink, '_blank')}
                        >
                          Apply Online
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">Min. Deposit</p>
                            <p className="text-sm text-muted-foreground">{bank.minDeposit}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">Monthly Fee</p>
                            <p className="text-sm text-muted-foreground">{bank.monthlyFee}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Key Features:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {bank.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">
                          <strong>Benefits:</strong> {bank.benefits}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => window.open(bank.applicationLink, '_blank')}
                          className="flex-1"
                        >
                          Apply Now
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(bank.website, '_blank')}
                        >
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Banking Tips */}
          <Card className="gradient-secondary shadow-medium">
            <CardHeader>
              <CardTitle className="text-white">Business Banking Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-white/90">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">What You'll Need to Open:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Business formation documents (LLC, Corp, etc.)</li>
                      <li>• Federal EIN (Tax ID Number)</li>
                      <li>• Personal identification (driver's license, passport)</li>
                      <li>• Initial deposit (varies by bank)</li>
                      <li>• Business license (if applicable)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Features to Look For:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Low or no monthly fees</li>
                      <li>• High transaction limits</li>
                      <li>• Mobile banking and check deposit</li>
                      <li>• Integration with accounting software</li>
                      <li>• Business credit card options</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/10 rounded-lg">
                  <p className="text-sm">
                    <strong>Important:</strong> Compare total costs including monthly fees, transaction fees, 
                    and minimum balance requirements. Many banks offer promotional rates for new business customers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BusinessBanking;