import React from 'react';

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  color?: string; // Tailwind color class prefix e.g., "indigo"
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, icon, children, color = "slate" }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-colors duration-200">
      <div className={`px-5 py-3 border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex items-center gap-2`}>
        <div className={`p-1.5 rounded-md bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
            {icon}
        </div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
};