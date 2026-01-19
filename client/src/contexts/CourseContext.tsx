import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import courseDataRaw from '@/lib/course-data.json';
import Fuse from 'fuse.js';

// 定义数据类型
export interface Section {
  id: string;
  title: string;
  content: string;
}

export interface Module {
  id: string;
  title: string;
  sections: Section[];
  content: string;
}

interface SearchResult {
  item: Module | Section;
  refIndex: number;
  score?: number;
  matches?: readonly any[];
  type: 'module' | 'section';
  moduleId: string; // 所属模块ID
  moduleTitle: string; // 所属模块标题
}

interface CourseContextType {
  modules: Module[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  activeModuleId: string | null;
  setActiveModuleId: (id: string | null) => void;
  activeSectionId: string | null;
  setActiveSectionId: (id: string | null) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // 加载数据
  useEffect(() => {
    // 确保数据类型正确
    setModules(courseDataRaw as Module[]);
    if (courseDataRaw.length > 0) {
      setActiveModuleId(courseDataRaw[0].id);
    }
  }, []);

  // 构建搜索索引
  const fuse = useMemo(() => {
    if (modules.length === 0) return null;

    // 扁平化数据以供搜索
    const searchItems: any[] = [];
    
    modules.forEach(module => {
      // 添加模块本身
      searchItems.push({
        ...module,
        type: 'module',
        moduleId: module.id,
        moduleTitle: module.title,
        // 移除sections以避免重复搜索内容
        sections: undefined 
      });
      
      // 添加章节
      module.sections.forEach(section => {
        searchItems.push({
          ...section,
          type: 'section',
          moduleId: module.id,
          moduleTitle: module.title
        });
      });
    });

    return new Fuse(searchItems, {
      keys: ['title', 'content'],
      threshold: 0.3,
      includeMatches: true,
      minMatchCharLength: 2,
      ignoreLocation: true
    });
  }, [modules]);

  // 执行搜索
  const searchResults = useMemo(() => {
    if (!searchQuery || !fuse) return [];
    return fuse.search(searchQuery).map(result => ({
      ...result,
      item: result.item as unknown as Module | Section,
      type: (result.item as any).type,
      moduleId: (result.item as any).moduleId,
      moduleTitle: (result.item as any).moduleTitle
    })) as SearchResult[];
  }, [searchQuery, fuse]);

  return (
    <CourseContext.Provider value={{
      modules,
      searchQuery,
      setSearchQuery,
      searchResults,
      activeModuleId,
      setActiveModuleId,
      activeSectionId,
      setActiveSectionId
    }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}
