import React, { useState } from 'react';
import { AccessibilityPanel } from './AccessibilityPanel';

export const AccessibilityButton: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="fixed right-4 bottom-20 z-40 w-14 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl flex items-center justify-center transition-all hover:scale-110 border-2 border-slate-700"
        aria-label="Abrir panel de accesibilidad"
      >
        <svg
          className="w-7 h-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v5" />
          <path d="M12 12l-3 5" />
          <path d="M12 12l3 5" />
          <path d="M7 9h10" />
        </svg>
      </button>

      <AccessibilityPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />
    </>
  );
};
