"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeaderControls() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-surface hover:bg-bg-hover border border-border-subtle text-text-muted hover:text-text-primary transition-colors focus-ring"
        title="Toggle Language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-[10px] font-bold ml-1 uppercase">{language}</span>
      </button>

      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-surface hover:bg-bg-hover border border-border-subtle text-text-muted hover:text-text-primary transition-colors focus-ring"
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </div>
  );
}
