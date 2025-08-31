import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  FileText, 
  Building, 
  Shield, 
  CreditCard, 
  Home,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const suiteSections = [
  {
    label: "Business Suite",
    items: [
      { 
        title: "Dashboard", 
        url: "/dashboard", 
        icon: Home,
        description: "Suite overview"
      },
    ]
  },
  {
    label: "Formation & Registration", 
    items: [
      { 
        title: "EIN Application", 
        url: "/ein-application", 
        icon: FileText,
        description: "Federal Tax ID"
      },
      { 
        title: "LLC Formation", 
        url: "/llc-application", 
        icon: Building,
        description: "State business entity"
      },
    ]
  },
  {
    label: "Compliance & Banking",
    items: [
      { 
        title: "Business Licenses", 
        url: "/business-licenses", 
        icon: Shield,
        description: "Required permits"
      },
      { 
        title: "Business Banking", 
        url: "/business-banking", 
        icon: CreditCard,
        description: "Bank account setup"
      },
    ]
  }
];

export function BusinessSuiteSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar
      className="transition-all duration-300 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      collapsible="icon"
    >
      <SidebarContent className="p-0">
        {/* Header */}
        <div className="p-4 border-b">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-lg">
                <Building className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Business Suite</h2>
                <p className="text-xs text-muted-foreground">Complete formation platform</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="flex justify-center">
              <div className="p-2 bg-primary rounded-lg">
                <Building className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-auto">
          {suiteSections.map((section, sectionIndex) => (
            <SidebarGroup key={section.label} className="px-3 py-2">
              {!isCollapsed && (
                <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1">
                  {section.label}
                </SidebarGroupLabel>
              )}
              
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild className="p-0">
                        <NavLink 
                          to={item.url} 
                          className={({ isActive }) => cn(
                            "flex items-center w-full p-2 rounded-lg transition-all duration-200 group",
                            getNavCls({ isActive }),
                            isCollapsed && "justify-center"
                          )}
                        >
                          <item.icon className={cn(
                            "h-4 w-4 flex-shrink-0",
                            !isCollapsed && "mr-3"
                          )} />
                          {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{item.title}</div>
                              <div className="text-xs text-muted-foreground">{item.description}</div>
                            </div>
                          )}
                          {!isCollapsed && isActive(item.url) && (
                            <ChevronRight className="h-3 w-3 opacity-60" />
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t bg-muted/30">
            <div className="text-center">
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Complete Business Suite
              </div>
              <div className="text-xs text-muted-foreground">
                4 modules • 50+ business types • All US states
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

// Toggle button component for mobile and desktop
export function BusinessSuiteToggle() {
  const { toggleSidebar } = useSidebar();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleSidebar}
      className="h-8 w-8 p-0"
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle Business Suite Navigation</span>
    </Button>
  );
}