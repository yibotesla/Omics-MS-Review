import React from 'react';
import { CourseProvider } from '@/contexts/CourseContext';
import { Sidebar } from '@/components/Sidebar';
import { ContentArea } from '@/components/ContentArea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <CourseProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-80 lg:w-96 h-full flex-shrink-0 z-20 shadow-xl shadow-black/5">
          <Sidebar />
        </div>

        {/* Mobile Header & Content */}
        <div className="flex-1 flex flex-col h-full min-w-0 relative">
          {/* Mobile Header */}
          <div className="md:hidden h-14 border-b border-border flex items-center px-4 bg-background/80 backdrop-blur-md sticky top-0 z-30">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80 border-r border-border">
                <Sidebar />
              </SheetContent>
            </Sheet>
            <span className="font-bold ml-2 truncate">Course Knowledge Base</span>
          </div>

          {/* Main Content Area */}
          <ContentArea />
        </div>
      </div>
    </CourseProvider>
  );
}
