"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigation, BreadcrumbItem } from '@/contexts/NavigationContext';

const Breadcrumbs = () => {
  const { breadcrumbs } = useNavigation();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex py-3 px-4 text-sm">
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link 
            href="/" 
            className="text-gray-500 hover:text-[#006D77] flex items-center"
          >
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        </li>
        
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index < breadcrumbs.length - 1 ? (
              <>
                <Link 
                  href={item.href} 
                  className="text-gray-500 hover:text-[#006D77]"
                >
                  {item.label}
                </Link>
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              </>
            ) : (
              <span className="text-[#006D77] font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
