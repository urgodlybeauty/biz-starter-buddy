import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BusinessSuiteSidebar, BusinessSuiteToggle } from "./BusinessSuiteSidebar";

interface BusinessSuiteLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function BusinessSuiteLayout({ children, showSidebar = true }: BusinessSuiteLayoutProps) {
  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <BusinessSuiteSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Global Navigation Toggle */}
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="flex items-center h-12 px-4">
              <BusinessSuiteToggle />
              <div className="ml-4 flex-1">
                <h1 className="text-sm font-medium text-muted-foreground">
                  Business Formation Suite
                </h1>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}