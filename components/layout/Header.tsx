'use client';

import React from 'react';
import { BellIcon, SearchIcon } from '@/components/assets/Icons';
import type { User } from '@/lib/types';

interface HeaderProps {
  user: User;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ user, title }) => {
  return (
    <header className="bg-surface border-b border-outline px-6 py-4 flex items-center justify-between">
      <div>
        {title && <h1 className="text-2xl font-semibold text-on-surface">{title}</h1>}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search */}
        <button className="p-2 rounded-lg text-on-surface-variant hover:bg-on-surface/5 transition-colors">
          <SearchIcon className="w-5 h-5" />
        </button>
        
        {/* Notifications */}
        <button className="p-2 rounded-lg text-on-surface-variant hover:bg-on-surface/5 transition-colors relative">
          <BellIcon className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
        
        {/* User Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
