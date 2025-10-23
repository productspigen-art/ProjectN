import React from 'react';
import type { Link } from '../types';
import { Icon } from './Icons';

interface LinkCardProps {
  link: Link;
}

const LinkCard: React.FC<LinkCardProps> = ({ link }) => {

  const navigateToUrl = (e: React.MouseEvent) => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
    e.preventDefault();
  };

  let itemClasses = `group relative flex items-center justify-center w-full p-3 bg-slate-700/50 rounded-md border border-transparent transition-all duration-200 hover:bg-slate-700 cursor-pointer`;

  if (link.isSpecial) {
    itemClasses += ' border-yellow-400/50 bg-yellow-900/20 shadow-lg shadow-yellow-400/10 hover:bg-yellow-900/30 hover:border-yellow-400';
  }

  const titleClasses = `flex-1 transition-colors truncate text-center ${
    link.isSpecial 
      ? 'text-yellow-300 font-bold group-hover:text-yellow-200' 
      : 'text-slate-200 group-hover:text-sky-400'
  }`;

  return (
    <div
      onClick={navigateToUrl}
      className={itemClasses}
    >
      <span className={titleClasses}>
        {link.title}
      </span>
    </div>
  );
};

export default LinkCard;