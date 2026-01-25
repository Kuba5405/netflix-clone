import React, { createContext, useContext, useState } from 'react';

type ContentType = 'all' | 'movies' | 'series';

interface BrowseContextType {
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const BrowseContext = createContext<BrowseContextType | undefined>(undefined);

export const BrowseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contentType, setContentType] = useState<ContentType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <BrowseContext.Provider value={{ contentType, setContentType, searchQuery, setSearchQuery }}>
      {children}
    </BrowseContext.Provider>
  );
};

export const useBrowse = () => {
  const context = useContext(BrowseContext);
  if (!context) {
    throw new Error('useBrowse must be used within BrowseProvider');
  }
  return context;
};
