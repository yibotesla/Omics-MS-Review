import React from 'react';
import { useCourse } from '@/contexts/CourseContext';
import { cn } from '@/lib/utils';
import { Search, BookOpen, Hash, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Sidebar() {
  const { 
    modules, 
    searchQuery, 
    setSearchQuery, 
    searchResults, 
    activeModuleId, 
    setActiveModuleId,
    activeSectionId,
    setActiveSectionId
  } = useCourse();

  const handleModuleClick = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setActiveSectionId(null);
    
    // 滚动到对应模块
    const element = document.getElementById(moduleId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSectionClick = (moduleId: string, sectionId: string) => {
    setActiveModuleId(moduleId);
    setActiveSectionId(sectionId);
    
    // 滚动到对应章节
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSearchResultClick = (result: any) => {
    const moduleId = result.moduleId;
    const sectionId = result.type === 'section' ? result.item.id : null;
    
    setActiveModuleId(moduleId);
    setActiveSectionId(sectionId);
    
    const targetId = sectionId || moduleId;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // 可选：点击搜索结果后清空搜索，或者保持搜索状态
    // setSearchQuery('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header & Search */}
      <div className="p-6 border-b border-sidebar-border bg-sidebar/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            K
          </div>
          <h1 className="font-bold text-lg tracking-tight">Knowledge Base</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search knowledge..." 
            className="pl-9 bg-background border-input focus-visible:ring-primary/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation List */}
      <ScrollArea className="flex-1 px-4 py-4">
        {searchQuery ? (
          <div className="space-y-1">
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Search Results ({searchResults.length})
            </div>
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <button
                  key={`${result.item.id}-${index}`}
                  onClick={() => handleSearchResultClick(result)}
                  className="w-full text-left px-3 py-2.5 rounded-md text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group flex flex-col gap-1"
                >
                  <div className="font-medium flex items-center gap-2">
                    {result.type === 'module' ? <BookOpen className="h-3.5 w-3.5 text-primary" /> : <Hash className="h-3.5 w-3.5 text-muted-foreground" />}
                    <span className="truncate">{result.item.title}</span>
                  </div>
                  <div className="text-xs text-muted-foreground pl-5.5 truncate">
                    in {result.moduleTitle}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 pb-10">
            {modules.map((module, index) => (
              <div key={module.id} className="space-y-1">
                <button
                  onClick={() => handleModuleClick(module.id)}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 group",
                    activeModuleId === module.id 
                      ? "text-primary" 
                      : "text-foreground hover:text-primary"
                  )}
                >
                  <span className="text-xs font-mono text-muted-foreground/50 group-hover:text-primary/50 w-5">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  {module.title}
                </button>
                
                {/* Sections */}
                <div className="ml-7 space-y-0.5 border-l border-sidebar-border/50 pl-2">
                  {module.sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(module.id, section.id)}
                      className={cn(
                        "w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors block truncate",
                        activeSectionId === section.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground bg-sidebar">
        <div className="flex justify-between items-center">
          <span>v1.0.0</span>
          <span>{modules.length} Modules</span>
        </div>
      </div>
    </div>
  );
}
