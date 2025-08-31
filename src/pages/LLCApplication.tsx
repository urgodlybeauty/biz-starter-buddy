import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Building, ArrowLeft, Printer, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const LLCApplication = () => {
  const { user, loading, isGuest } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    llc_name: '',
    business_purpose: '',
    business_address: '',
    business_city: '',
    business_state: '',
    business_zip: '',
    registered_agent_name: '',
    registered_agent_address: '',
    organizer_name: '',
    organizer_address: '',
    management_structure: 'member-managed',
    member_names: [''],
    duration: 'perpetual',
    effective_date: ''
  });

  useEffect(() => {
    if (!loading && !user && !isGuest) return;
    
    const loadExistingData = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('llc_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error loading LLC application:', error);
        return;
      }

      if (data && data.length > 0) {
        const application = data[0];
        setFormData({
          llc_name: application.llc_name || '',
          business_purpose: application.business_purpose || '',
          business_address: application.business_address || '',
          business_city: application.business_city || '',
          business_state: application.business_state || '',
          business_zip: application.business_zip || '',
          registered_agent_name: application.registered_agent_name || '',
          registered_agent_address: application.registered_agent_address || '',
          organizer_name: application.organizer_name || '',
          organizer_address: application.organizer_address || '',
          management_structure: application.management_structure || 'member-managed',
          member_names: application.member_names || [''],
          duration: application.duration || 'perpetual',
          effective_date: application.effective_date || ''
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

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 
    'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 
    'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...formData.member_names];
    newMembers[index] = value;
    setFormData(prev => ({ ...prev, member_names: newMembers }));
  };

  const addMember = () => {
    setFormData(prev => ({ ...prev, member_names: [...prev.member_names, ''] }));
  };

  const removeMember = (index: number) => {
    const newMembers = formData.member_names.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, member_names: newMembers }));
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign up to save your LLC application.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('llc_applications')
        .upsert({
          user_id: user.id,
          ...formData,
          member_names: formData.member_names.filter(name => name.trim() !== ''),
          effective_date: formData.effective_date || null
        });

      if (error) throw error;

      toast({
        title: "LLC Application Saved",
        description: "Your LLC application has been saved successfully."
      });
    } catch (error) {
      console.error('Error saving LLC application:', error);
      toast({
        title: "Error",
        description: "Failed to save LLC application. Please try again.",
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
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">LLC Formation</h1>
                  <p className="text-white/80">Form your LLC directly with your state</p>
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
              <CardTitle className="text-2xl">LLC Formation Guide</CardTitle>
              <CardDescription className="text-base">
                Complete this form to prepare your LLC filing paperwork. We'll guide you to file directly 
                with your state government to save on fees. Most states charge $50-$200 for LLC formation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Save Money:</strong> By filing directly with your state, you avoid expensive third-party 
                  service fees that can cost $300+ extra. We recommend acting as your own registered agent to save 
                  additional annual fees.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* LLC Information */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>LLC Information</CardTitle>
              <CardDescription>Basic information about your LLC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="llc_name">LLC Name *</Label>
                <Input
                  id="llc_name"
                  value={formData.llc_name}
                  onChange={(e) => handleInputChange('llc_name', e.target.value)}
                  placeholder="Example: Acme Consulting LLC"
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your LLC name must end with "LLC" or "Limited Liability Company" and be unique in your state.
                </p>
              </div>

              <div>
                <Label htmlFor="business_purpose">Business Purpose *</Label>
                <Textarea
                  id="business_purpose"
                  value={formData.business_purpose}
                  onChange={(e) => handleInputChange('business_purpose', e.target.value)}
                  placeholder="Example: To provide marketing consulting services to small businesses"
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Describe what your LLC will do. This can be general like "any lawful business activity."
                </p>
              </div>

              <div>
                <Label htmlFor="management_structure">Management Structure *</Label>
                <Select
                  value={formData.management_structure}
                  onValueChange={(value) => handleInputChange('management_structure', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member-managed">Member-Managed</SelectItem>
                    <SelectItem value="manager-managed">Manager-Managed</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Member-managed means all owners make decisions. Manager-managed means you appoint specific managers.
                </p>
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => handleInputChange('duration', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perpetual">Perpetual (No End Date)</SelectItem>
                    <SelectItem value="specific">Specific End Date</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-1">
                  Most LLCs choose "Perpetual" meaning the LLC continues indefinitely.
                </p>
              </div>

              <div>
                <Label htmlFor="effective_date">Effective Date (Optional)</Label>
                <Input
                  id="effective_date"
                  type="date"
                  value={formData.effective_date}
                  onChange={(e) => handleInputChange('effective_date', e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Leave blank to have your LLC effective immediately upon filing.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Business Address */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Business Address</CardTitle>
              <CardDescription>Your LLC's principal business address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="business_address">Street Address *</Label>
                <Input
                  id="business_address"
                  value={formData.business_address}
                  onChange={(e) => handleInputChange('business_address', e.target.value)}
                  placeholder="Example: 123 Main Street, Suite 100"
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="business_city">City *</Label>
                  <Input
                    id="business_city"
                    value={formData.business_city}
                    onChange={(e) => handleInputChange('business_city', e.target.value)}
                    placeholder="Example: Philadelphia"
                    className="mt-2"
                  />
                </div>
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Registered Agent */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Registered Agent</CardTitle>
              <CardDescription>The person or company to receive legal documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Save Money:</strong> You can act as your own registered agent to avoid annual fees 
                  ($100-$300/year). Just make sure someone is available during business hours to receive documents.
                </p>
              </div>

              <div>
                <Label htmlFor="registered_agent_name">Registered Agent Name *</Label>
                <Input
                  id="registered_agent_name"
                  value={formData.registered_agent_name}
                  onChange={(e) => handleInputChange('registered_agent_name', e.target.value)}
                  placeholder="Example: John Smith (yourself) or ABC Registered Agent Service"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="registered_agent_address">Registered Agent Address *</Label>
                <Textarea
                  id="registered_agent_address"
                  value={formData.registered_agent_address}
                  onChange={(e) => handleInputChange('registered_agent_address', e.target.value)}
                  placeholder="Example: 123 Main Street, Philadelphia, PA 19101"
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Must be a physical address in the same state where you're forming the LLC.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Organizer Information */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Organizer Information</CardTitle>
              <CardDescription>The person filing the LLC paperwork</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="organizer_name">Organizer Name *</Label>
                <Input
                  id="organizer_name"
                  value={formData.organizer_name}
                  onChange={(e) => handleInputChange('organizer_name', e.target.value)}
                  placeholder="Example: John Smith"
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This is usually yourself - the person submitting the LLC formation documents.
                </p>
              </div>

              <div>
                <Label htmlFor="organizer_address">Organizer Address *</Label>
                <Textarea
                  id="organizer_address"
                  value={formData.organizer_address}
                  onChange={(e) => handleInputChange('organizer_address', e.target.value)}
                  placeholder="Example: 456 Oak Avenue, Philadelphia, PA 19102"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Members */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>LLC Members</CardTitle>
              <CardDescription>List all owners of the LLC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Add all people or entities that will own part of the LLC. You can have just yourself as the only member.
              </p>
              
              {formData.member_names.map((member, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor={`member_${index}`}>Member {index + 1} Name</Label>
                    <Input
                      id={`member_${index}`}
                      value={member}
                      onChange={(e) => handleMemberChange(index, e.target.value)}
                      placeholder="Example: John Smith"
                      className="mt-2"
                    />
                  </div>
                  {formData.member_names.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeMember(index)}
                      className="mt-8"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={addMember}
                className="w-full"
              >
                Add Another Member
              </Button>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="gradient-secondary shadow-medium">
            <CardHeader>
              <CardTitle className="text-white">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-white/90">
                <p>After completing this form:</p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Print or save this completed form</li>
                  <li>Visit your state's business filing website</li>
                  <li>Submit your LLC formation documents online</li>
                  <li>Pay the state filing fee (typically $50-$200)</li>
                  <li>Receive your Certificate of Formation</li>
                </ol>
                <div className="mt-4 p-4 bg-white/10 rounded-lg">
                  <p className="font-semibold">State Filing Resources:</p>
                  <p className="text-sm mt-1">
                    We'll provide direct links to your state's LLC filing portal based on your address.
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

export default LLCApplication;