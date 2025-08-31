import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, Printer, ExternalLink, Save, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EINApplication = () => {
  const { user, isGuest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    responsiblePartyName: '',
    responsiblePartySSN: '',
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessZip: '',
    mailingAddress: '',
    businessPurpose: '',
    employeesExpected: '0',
    bankingInfo: '',
    federalTaxDeposits: '',
    businessActivityCode: ''
  });

  // Load existing data on component mount
  useEffect(() => {
    if (user && !isGuest) {
      loadExistingData();
    }
  }, [user, isGuest]);

  const loadExistingData = async () => {
    try {
      const { data, error } = await supabase
        .from('ein_applications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const application = data[0];
        setFormData({
          businessName: application.business_name || '',
          businessType: application.business_type || '',
          responsiblePartyName: application.responsible_party_name || '',
          responsiblePartySSN: application.responsible_party_ssn || '',
          businessAddress: application.business_address || '',
          businessCity: application.business_city || '',
          businessState: application.business_state || '',
          businessZip: application.business_zip || '',
          mailingAddress: application.mailing_address || '',
          businessPurpose: application.business_purpose || '',
          employeesExpected: application.employees_expected?.toString() || '0',
          bankingInfo: application.banking_info || '',
          federalTaxDeposits: application.federal_tax_deposits || '',
          businessActivityCode: application.business_activity_code || ''
        });
        
        if (application.start_date) {
          setStartDate(new Date(application.start_date));
        }
      }
    } catch (error) {
      console.error('Error loading existing data:', error);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveData = async () => {
    if (!user || isGuest) {
      toast({
        title: "Cannot Save",
        description: "Please create an account to save your progress.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('ein_applications')
        .upsert({
          user_id: user.id,
          business_name: formData.businessName,
          business_type: formData.businessType,
          responsible_party_name: formData.responsiblePartyName,
          responsible_party_ssn: formData.responsiblePartySSN,
          business_address: formData.businessAddress,
          business_city: formData.businessCity,
          business_state: formData.businessState,
          business_zip: formData.businessZip,
          mailing_address: formData.mailingAddress,
          business_purpose: formData.businessPurpose,
          start_date: startDate?.toISOString().split('T')[0],
          employees_expected: parseInt(formData.employeesExpected) || 0,
          banking_info: formData.bankingInfo,
          federal_tax_deposits: formData.federalTaxDeposits,
          business_activity_code: formData.businessActivityCode
        });

      if (error) throw error;

      toast({
        title: "Data Saved",
        description: "Your EIN application information has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const printForm = () => {
    window.print();
  };

  const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Corporation',
    'LLC',
    'Non-Profit Organization',
    'Estate',
    'Trust',
    'Other'
  ];

  const stateOptions = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <Link 
              to="/dashboard" 
              className="flex items-center text-white hover:text-white/80 transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Link>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={saveData}
                disabled={loading || isGuest}
                className="border-white/20 text-white hover:bg-white/10 no-print"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Progress
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={printForm}
                className="border-white/20 text-white hover:bg-white/10 no-print"
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Form
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-only mb-6">
          <h1 className="text-2xl font-bold text-center">EIN Application Information</h1>
          <p className="text-center text-muted-foreground">Generated by Business Suite</p>
        </div>

        <div className="mb-8 no-print">
          <h1 className="text-3xl font-bold mb-4">EIN Application Assistant</h1>
          <p className="text-lg text-muted-foreground mb-6">
            An Employer Identification Number (EIN) is your business's tax ID number. 
            Fill out this form to prepare for your free application with the IRS.
          </p>
          
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              This form helps you prepare your information. You'll apply for free directly with the IRS at{' '}
              <a 
                href="https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                irs.gov
              </a>
            </AlertDescription>
          </Alert>
        </div>

        <div className="space-y-8">
          {/* Business Information */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Basic details about your business entity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="businessName" className="text-sm font-medium mb-2 block">
                  Legal Business Name *
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Example: "Acme Consulting LLC" or "John Smith Sole Proprietorship"
                </p>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange('businessName')}
                  placeholder="Enter your legal business name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="businessType" className="text-sm font-medium mb-2 block">
                  Business Type *
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Choose the legal structure of your business
                </p>
                <Select onValueChange={handleSelectChange('businessType')} value={formData.businessType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="businessPurpose" className="text-sm font-medium mb-2 block">
                  Business Purpose *
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Example: "Web design services" or "Retail clothing sales"
                </p>
                <Textarea
                  id="businessPurpose"
                  value={formData.businessPurpose}
                  onChange={handleInputChange('businessPurpose')}
                  placeholder="Describe what your business does"
                  className="h-20"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Business Start Date
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  When did or will your business start operations?
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Responsible Party Information */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Responsible Party Information</CardTitle>
              <CardDescription>
                Person who has control or authority over the business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="responsiblePartyName" className="text-sm font-medium mb-2 block">
                  Full Name *
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Example: "John Michael Smith"
                </p>
                <Input
                  id="responsiblePartyName"
                  value={formData.responsiblePartyName}
                  onChange={handleInputChange('responsiblePartyName')}
                  placeholder="First Middle Last"
                  required
                />
              </div>

              <div>
                <Label htmlFor="responsiblePartySSN" className="text-sm font-medium mb-2 block">
                  Social Security Number
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Required for sole proprietorships and some business types
                </p>
                <Input
                  id="responsiblePartySSN"
                  value={formData.responsiblePartySSN}
                  onChange={handleInputChange('responsiblePartySSN')}
                  placeholder="XXX-XX-XXXX"
                  type="password"
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Address */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Business Address</CardTitle>
              <CardDescription>
                Physical location where your business operates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="businessAddress" className="text-sm font-medium mb-2 block">
                  Street Address *
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Example: "123 Main Street, Suite 100"
                </p>
                <Input
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleInputChange('businessAddress')}
                  placeholder="Street address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="businessCity" className="text-sm font-medium mb-2 block">
                    City *
                  </Label>
                  <Input
                    id="businessCity"
                    value={formData.businessCity}
                    onChange={handleInputChange('businessCity')}
                    placeholder="City"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessState" className="text-sm font-medium mb-2 block">
                    State *
                  </Label>
                  <Select onValueChange={handleSelectChange('businessState')} value={formData.businessState}>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      {stateOptions.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="businessZip" className="text-sm font-medium mb-2 block">
                    ZIP Code *
                  </Label>
                  <Input
                    id="businessZip"
                    value={formData.businessZip}
                    onChange={handleInputChange('businessZip')}
                    placeholder="12345"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mailingAddress" className="text-sm font-medium mb-2 block">
                  Mailing Address (if different)
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Leave blank if same as business address
                </p>
                <Textarea
                  id="mailingAddress"
                  value={formData.mailingAddress}
                  onChange={handleInputChange('mailingAddress')}
                  placeholder="Mailing address if different from business address"
                  className="h-20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Extra details the IRS may require
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="employeesExpected" className="text-sm font-medium mb-2 block">
                  Expected Number of Employees
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  How many employees do you expect to have in the next 12 months?
                </p>
                <Input
                  id="employeesExpected"
                  type="number"
                  value={formData.employeesExpected}
                  onChange={handleInputChange('employeesExpected')}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="bankingInfo" className="text-sm font-medium mb-2 block">
                  Banking Information
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Will you have a business bank account? Any banking details?
                </p>
                <Textarea
                  id="bankingInfo"
                  value={formData.bankingInfo}
                  onChange={handleInputChange('bankingInfo')}
                  placeholder="Banking plans or information"
                  className="h-20"
                />
              </div>

              <div>
                <Label htmlFor="federalTaxDeposits" className="text-sm font-medium mb-2 block">
                  Federal Tax Deposits Schedule
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  How often will you make federal tax deposits? (Monthly, Quarterly, etc.)
                </p>
                <Input
                  id="federalTaxDeposits"
                  value={formData.federalTaxDeposits}
                  onChange={handleInputChange('federalTaxDeposits')}
                  placeholder="e.g., Monthly, Quarterly"
                />
              </div>

              <div>
                <Label htmlFor="businessActivityCode" className="text-sm font-medium mb-2 block">
                  Business Activity Code
                </Label>
                <p className="text-xs text-muted-foreground mb-2">
                  NAICS code for your business activity (you can look this up on the IRS website)
                </p>
                <Input
                  id="businessActivityCode"
                  value={formData.businessActivityCode}
                  onChange={handleInputChange('businessActivityCode')}
                  placeholder="e.g., 541511 for Custom Computer Programming Services"
                />
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="shadow-medium gradient-card no-print">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ExternalLink className="mr-2 h-5 w-5 text-primary" />
                Ready to Apply for Your EIN?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Now that you have all your information ready, you can apply for your EIN 
                for free directly with the IRS. This typically takes 10-15 minutes online.
              </p>
              
              <div className="space-y-3">
                <Button asChild className="w-full gradient-primary">
                  <a 
                    href="https://www.irs.gov/businesses/small-businesses-self-employed/get-an-employer-identification-number"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Apply for EIN at IRS.gov (Free)
                  </a>
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  ⚠️ Only apply through the official IRS website. Avoid third-party services that charge fees.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EINApplication;