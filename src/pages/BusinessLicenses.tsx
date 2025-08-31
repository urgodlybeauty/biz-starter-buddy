import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, ArrowLeft, Printer, Save, ExternalLink, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const BusinessLicenses = () => {
  const { user, loading, isGuest } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [formData, setFormData] = useState({
    business_type: '',
    business_state: '',
    business_zip: '',
    required_licenses: [] as string[],
    license_links: [] as string[],
    permit_requirements: [] as string[]
  });

  // Predefined business types with their typical license requirements
  const businessTypes = [
    { value: 'restaurant', label: 'Restaurant/Food Service', licenses: ['Food Service License', 'Liquor License (if applicable)', 'Business License', 'Health Department Permit'] },
    { value: 'retail', label: 'Retail Store', licenses: ['Business License', 'Sales Tax Permit', 'Signage Permit'] },
    { value: 'consulting', label: 'Consulting/Professional Services', licenses: ['Business License', 'Professional License (if applicable)'] },
    { value: 'construction', label: 'Construction/Contractor', licenses: ['Contractor License', 'Business License', 'Building Permits'] },
    { value: 'healthcare', label: 'Healthcare Services', licenses: ['Professional License', 'Business License', 'Health Department Permit'] },
    { value: 'automotive', label: 'Automotive Services', licenses: ['Business License', 'Automotive Service License', 'Environmental Permits'] },
    { value: 'beauty', label: 'Beauty/Salon Services', licenses: ['Cosmetology License', 'Business License', 'Health Department Permit'] },
    { value: 'childcare', label: 'Childcare/Education', licenses: ['Childcare License', 'Business License', 'Background Check Clearance'] },
    { value: 'fitness', label: 'Fitness/Gym', licenses: ['Business License', 'Health Department Permit', 'Fire Department Clearance'] },
    { value: 'transportation', label: 'Transportation Services', licenses: ['Business License', 'Commercial Driver License', 'DOT Registration'] },
    { value: 'manufacturing', label: 'Manufacturing', licenses: ['Business License', 'Environmental Permits', 'Safety Compliance'] },
    { value: 'technology', label: 'Technology/Software', licenses: ['Business License', 'Data Privacy Compliance'] },
    { value: 'other', label: 'Other', licenses: ['Business License'] }
  ];

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 
    'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 
    'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  useEffect(() => {
    if (!loading && !user && !isGuest) return;
    
    const loadExistingData = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('business_licenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error loading business licenses:', error);
        return;
      }

      if (data && data.length > 0) {
        const licenses = data[0];
        setFormData({
          business_type: licenses.business_type || '',
          business_state: licenses.business_state || '',
          business_zip: licenses.business_zip || '',
          required_licenses: licenses.required_licenses || [],
          license_links: licenses.license_links || [],
          permit_requirements: licenses.permit_requirements || []
        });
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBusinessTypeChange = (businessType: string) => {
    const selectedType = businessTypes.find(type => type.value === businessType);
    if (selectedType) {
      setFormData(prev => ({
        ...prev,
        business_type: businessType,
        required_licenses: selectedType.licenses,
        license_links: selectedType.licenses.map(() => ''), // Placeholder for links
        permit_requirements: []
      }));
    }
  };

  const searchLicenses = async () => {
    if (!formData.business_type || !formData.business_state) {
      toast({
        title: "Missing Information",
        description: "Please select your business type and state first.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API call - in a real app, this would call government APIs
    setTimeout(() => {
      const selectedType = businessTypes.find(type => type.value === formData.business_type);
      if (selectedType) {
        // Add state-specific requirements
        const stateRequirements = [
          'State Business Registration',
          'State Tax Registration',
          'Workers\' Compensation (if employees)',
          'Unemployment Insurance (if employees)'
        ];

        setFormData(prev => ({
          ...prev,
          required_licenses: [...selectedType.licenses, ...stateRequirements],
          license_links: [...selectedType.licenses, ...stateRequirements].map(() => `https://${formData.business_state.toLowerCase()}.gov/business-licenses`),
          permit_requirements: [
            'Complete business registration with state',
            'Obtain federal EIN if needed',
            'Register for state and local taxes',
            'Check zoning compliance for business location'
          ]
        }));
        
        toast({
          title: "Licenses Found",
          description: `Found ${selectedType.licenses.length + stateRequirements.length} required licenses and permits.`
        });
      }
      setIsSearching(false);
    }, 2000);
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign up to save your business license information.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('business_licenses')
        .upsert({
          user_id: user.id,
          ...formData
        });

      if (error) throw error;

      toast({
        title: "Business Licenses Saved",
        description: "Your business license information has been saved successfully."
      });
    } catch (error) {
      console.error('Error saving business licenses:', error);
      toast({
        title: "Error",
        description: "Failed to save business license information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary shadow-soft print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Business Licenses & Permits</h1>
                  <p className="text-white/80">Find required licenses for your business</p>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <Card className="gradient-card shadow-soft">
            <CardHeader>
              <CardTitle className="text-2xl">Business License Finder</CardTitle>
              <CardDescription className="text-base">
                Every business needs proper licenses and permits to operate legally. We'll help you identify 
                what's required for your specific business type and location, then guide you to the official 
                government websites to apply directly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Important:</strong> License requirements vary by business type, location, and local regulations. 
                    Always verify with your local government offices for the most current requirements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Tell us about your business to find relevant licenses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="business_type">What type of business are you starting? *</Label>
                <Select
                  value={formData.business_type}
                  onValueChange={handleBusinessTypeChange}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose the category that best describes your business. This helps us identify relevant licenses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_state">State *</Label>
                  <Select
                    value={formData.business_state}
                    onValueChange={(value) => handleInputChange('business_state', value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    State where your business will operate
                  </p>
                </div>
                <div>
                  <Label htmlFor="business_zip">ZIP Code *</Label>
                  <Input
                    id="business_zip"
                    value={formData.business_zip}
                    onChange={(e) => handleInputChange('business_zip', e.target.value)}
                    placeholder="Example: 19101"
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Local regulations may apply based on your ZIP code
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={searchLicenses}
                  disabled={isSearching || !formData.business_type || !formData.business_state}
                  className="w-full md:w-auto"
                >
                  {isSearching ? 'Searching...' : 'Find Required Licenses'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Required Licenses */}
          {formData.required_licenses.length > 0 && (
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Required Licenses & Permits</CardTitle>
                <CardDescription>
                  Based on your business type and location, here are the licenses you may need
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.required_licenses.map((license, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{license}</h4>
                        <p className="text-sm text-muted-foreground">
                          Required for {businessTypes.find(t => t.value === formData.business_type)?.label} businesses
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(formData.license_links[index] || `https://${formData.business_state.toLowerCase()}.gov/business-licenses`, '_blank')}
                      >
                        Apply Online
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Requirements Checklist */}
          {formData.permit_requirements.length > 0 && (
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Getting Started Checklist</CardTitle>
                <CardDescription>Follow these steps to ensure you have all required licenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formData.permit_requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <span className="text-xs font-medium text-primary">{index + 1}</span>
                      </div>
                      <p className="text-sm">{requirement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* State Resources */}
          <Card className="gradient-secondary shadow-medium">
            <CardHeader>
              <CardTitle className="text-white">State Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-white/90">
                <p>Helpful government resources for business licensing:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/10 rounded-lg">
                    <h4 className="font-semibold">SBA.gov</h4>
                    <p className="text-sm mt-1">
                      Small Business Administration - federal requirements and guidance
                    </p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-lg">
                    <h4 className="font-semibold">State Business Portal</h4>
                    <p className="text-sm mt-1">
                      Your state's official business registration and licensing website
                    </p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-lg">
                    <h4 className="font-semibold">Local City/County</h4>
                    <p className="text-sm mt-1">
                      Contact your local government for city and county requirements
                    </p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-lg">
                    <h4 className="font-semibold">Industry Associations</h4>
                    <p className="text-sm mt-1">
                      Professional associations often provide licensing guidance
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BusinessLicenses;