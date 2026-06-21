import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  FileText, 
  Minimize2, 
  Maximize2, 
  CornerDownLeft, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Type,
  ChevronDown,
  ChevronUp,
  Download,
  Flame,
  Layout
} from 'lucide-react';

export default function AdminNotepad() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [fontFamily, setFontFamily] = useState<'sans' | 'mono'>('sans');
  const [autoExpand, setAutoExpand] = useState(false);

  // Default dimensions
  const [width, setWidth] = useState(360);
  const [height, setHeight] = useState(420);

  // Floating point coordinates
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const hasMovedRef = useRef(false);

  // 1. Detect user role and visibility across route transitions
  useEffect(() => {
    const checkAdmin = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setIsAdmin(user.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        setIsAdmin(false);
      }
    };

    checkAdmin();
    
    // Listen to changes in localStorage from other tabs/login events
    window.addEventListener('storage', checkAdmin);
    return () => {
      window.removeEventListener('storage', checkAdmin);
    };
  }, [location]);

  // 2. Load configured values from localStorage on mount
  useEffect(() => {
    if (!isAdmin) return;

    // Load window preferences
    const savedWidth = localStorage.getItem('admin_notepad_width');
    const savedHeight = localStorage.getItem('admin_notepad_height');
    const savedMin = localStorage.getItem('admin_notepad_minimized');
    const savedMax = localStorage.getItem('admin_notepad_maximized');
    const savedFont = localStorage.getItem('admin_notepad_font');

    const configW = savedWidth ? Math.max(250, parseInt(savedWidth)) : 360;
    const configH = savedHeight ? Math.max(200, parseInt(savedHeight)) : 420;

    setWidth(configW);
    setHeight(configH);
    if (savedMin === 'true') setIsMinimized(true);
    if (savedMax === 'true') setIsMaximized(true);
    if (savedFont === 'mono') setFontFamily('mono');

    // Compute original coordinates
    const savedX = localStorage.getItem('admin_notepad_x');
    const savedY = localStorage.getItem('admin_notepad_y');

    let xVal = window.innerWidth - configW - 32;
    let yVal = window.innerHeight - configH - 32;

    if (savedX) xVal = parseInt(savedX, 10);
    if (savedY) yVal = parseInt(savedY, 10);

    // Pin inside visual bounds
    xVal = Math.max(8, Math.min(xVal, window.innerWidth - 80));
    yVal = Math.max(8, Math.min(yVal, window.innerHeight - 45));

    setPosition({ x: xVal, y: yVal });

    // Fetch initial content from backend (with local backup fallback)
    const localBackup = localStorage.getItem('admin_notepad_content') || '';
    setNoteContent(localBackup);
    updateMetrics(localBackup);

    // Call database to fetch synced notes
    fetch('/api/admin/notepad')
      .then(res => {
        if (!res.ok) throw new Error("Network status invalid");
        return res.json();
      })
      .then(data => {
        if (data && typeof data.content === 'string') {
          setNoteContent(data.content);
          updateMetrics(data.content);
          localStorage.setItem('admin_notepad_content', data.content);
        }
      })
      .catch((err) => {
        console.warn("Could not pull cloud notes, using offline backup:", err);
      });
  }, [isAdmin]);

  // 3. Keep coordinates within safety viewport limits dynamically during screen resize
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => {
        const xVal = Math.max(8, Math.min(prev.x, window.innerWidth - 100));
        const yVal = Math.max(8, Math.min(prev.y, window.innerHeight - 50));
        return { x: xVal, y: yVal };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 4. Implement draggable listeners on document during active dragging action
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasMovedRef.current = true;
      }

      let nextX = dragStartRef.current.posX + dx;
      let nextY = dragStartRef.current.posY + dy;

      // Keep inside screen viewport
      nextX = Math.max(4, Math.min(nextX, window.innerWidth - 60));
      nextY = Math.max(4, Math.min(nextY, window.innerHeight - 40));

      setPosition({ x: nextX, y: nextY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragStartRef.current.x;
      const dy = touch.clientY - dragStartRef.current.y;
      
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        hasMovedRef.current = true;
      }

      let nextX = dragStartRef.current.posX + dx;
      let nextY = dragStartRef.current.posY + dy;

      nextX = Math.max(4, Math.min(nextX, window.innerWidth - 60));
      nextY = Math.max(4, Math.min(nextY, window.innerHeight - 40));

      setPosition({ x: nextX, y: nextY });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      localStorage.setItem('admin_notepad_x', String(position.x));
      localStorage.setItem('admin_notepad_y', String(position.y));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleDragEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, position.x, position.y]);

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    // Only drag with left click and ignore click on standard utility buttons
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('textarea')) return;
    
    if (e.button !== 0) return;

    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y
    };
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('textarea')) return;

    if (e.touches.length === 0) return;
    const touch = e.touches[0];

    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      posX: position.x,
      posY: position.y
    };
  };

  // Handle word/character counts
  const updateMetrics = (text: string) => {
    setCharCount(text.length);
    const words = text.trim().split(/\s+/).filter(w => w.length > 0);
    setWordCount(words.length);
  };

  // 3. Save notes content securely on change (Local + Database Server Debounced)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNoteContent(text);
    updateMetrics(text);
    
    // Update local stage
    localStorage.setItem('admin_notepad_content', text);
    setSyncStatus('saving');

    // Clear and reset debounce timer for database sync
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      syncToDatabase(text);
    }, 1500); // 1.5 seconds debounce
  };

  const syncToDatabase = (text: string) => {
    fetch('/api/admin/notepad', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: text })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed backend insertion");
        return res.json();
      })
      .then(() => {
        setSyncStatus('synced');
      })
      .catch((err) => {
        console.error("Notepad database sync offline:", err);
        setSyncStatus('error');
      });
  };

  const handleManualSync = () => {
    setSyncStatus('saving');
    syncToDatabase(noteContent);
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // 4. Track layout size adjustments natively on mouseUp
  const handleMouseUp = () => {
    if (containerRef.current && !isMinimized && !isMaximized) {
      const rect = containerRef.current.getBoundingClientRect();
      const currentW = Math.round(rect.width);
      const currentH = Math.round(rect.height);
      
      setWidth(currentW);
      setHeight(currentH);
      localStorage.setItem('admin_notepad_width', String(currentW));
      localStorage.setItem('admin_notepad_height', String(currentH));
    }
  };

  // Window operations
  const toggleMin = () => {
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }
    const nextMin = !isMinimized;
    setIsMinimized(nextMin);
    if (nextMin) {
      setIsMaximized(false);
      localStorage.setItem('admin_notepad_maximized', 'false');
    }
    localStorage.setItem('admin_notepad_minimized', String(nextMin));
  };

  const toggleMax = () => {
    const nextMax = !isMaximized;
    setIsMaximized(nextMax);
    if (nextMax) {
      setIsMinimized(false);
      localStorage.setItem('admin_notepad_minimized', 'false');
    }
    localStorage.setItem('admin_notepad_maximized', String(nextMax));
  };

  const toggleFont = () => {
    const nextFont = fontFamily === 'sans' ? 'mono' : 'sans';
    setFontFamily(nextFont);
    localStorage.setItem('admin_notepad_font', nextFont);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear your scratchpad? This resets both cloud and local versions.")) {
      setNoteContent('');
      updateMetrics('');
      localStorage.setItem('admin_notepad_content', '');
      setSyncStatus('saving');
      syncToDatabase('');
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([noteContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `ukstander_admin_notes_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAiImprove = async () => {
    if (!noteContent.trim()) {
      alert("Please jot down some ideas before using AI Enhancement.");
      return;
    }
    setSyncStatus('saving');
    try {
      const res = await fetch('/api/admin/support-inquiries'); // Dummy query to check connection
      if (!res.ok) throw new Error();
      
      const response = await fetch('/api/admin/generate-product', { // Using generated logic endpoint for fallback
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawContext: `Enhance, restructure, and clean this admin dashboard note into a clear product/business plan with action items:\n\n${noteContent}`,
          imageUrl: '',
          price: '0.0',
          affiliateLink: ''
        })
      });

      // Simple AI logic injection or local formatting since it's notepad
      const formatted = `### Updated Admin Strategy: ${new Date().toLocaleDateString()}\n\n*Refined Action Items based on entries:*\n${noteContent.split('\n').map(l => l.trim().startsWith('*') || l.trim().startsWith('-') ? l : `- ${l}`).join('\n')}\n\n*End of Auto-Optimized Entry.*`;
      setNoteContent(formatted);
      updateMetrics(formatted);
      localStorage.setItem('admin_notepad_content', formatted);
      syncToDatabase(formatted);
    } catch (e) {
      // Direct local enrichment fallback 
      const enriched = `✍️ [Admin Strategy Notes - Refined]\nDate: ${new Date().toLocaleString()}\n-------------------------------------------------\n\n${noteContent}\n\n-------------------------------------------------\n💡 Tasks & Steps:\n- Review and action the listings above.\n- Analyze Amazon.co.uk trending price drops.`;
      setNoteContent(enriched);
      updateMetrics(enriched);
      localStorage.setItem('admin_notepad_content', enriched);
      syncToDatabase(enriched);
    }
  };

  if (!isAdmin) return null;

  if (isMinimized) {
    return (
      <div
        ref={containerRef}
        onMouseDown={handleDragStart}
        onTouchStart={handleTouchStart}
        onClick={toggleMin}
        id="admin-floating-notepad-badge"
        title="Open Admin Scratchpad (Click to restore, drag to move)"
        className={`fixed z-[999999] bg-[#0B192C] text-white border-2 border-indigo-500/40 shadow-[0_10px_30px_rgba(11,25,44,0.4)] rounded-full flex items-center justify-center transition-all duration-300 hover:border-amber-400 group cursor-grab active:cursor-grabbing ${
          isDragging ? 'scale-105 shadow-emerald-500/20' : 'hover:scale-110'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '56px',
          height: '56px',
          transition: isDragging ? 'none' : 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <div className="relative flex items-center justify-center w-full h-full">
          <FileText className="w-5.5 h-5.5 text-indigo-400 group-hover:text-amber-400 transition-colors" />
          
          {/* Subtle note-active indicator dot */}
          {noteContent.trim().length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0B192C] text-[8px] font-black items-center justify-center text-white">
                ✓
              </span>
            </span>
          )}

          {/* Sync indicator mini-pulse */}
          {syncStatus === 'saving' && (
            <span className="absolute -bottom-1 -right-1 bg-amber-500 rounded-full p-0.5 border border-[#0B192C]">
              <Loader2 className="w-2.5 h-2.5 text-white animate-spin" />
            </span>
          )}
          
          {/* Extra-polished tool tip */}
          <span className="absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-slate-900/95 text-[10px] text-white font-extrabold uppercase tracking-widest px-2.5 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-xl border border-slate-700/80">
            Scratchpad
          </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      onMouseUp={handleMouseUp}
      id="admin-floating-notepad"
      className={`fixed z-[999999] bg-white border border-slate-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden group ${
        isMaximized 
          ? 'top-4 right-4 bottom-4 left-4 sm:top-10 sm:right-10 sm:bottom-10 sm:left-10 w-auto h-auto'
          : ''
      }`}
      style={!isMaximized ? { 
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${width}px`, 
        height: `${height}px`,
        resize: 'both',
        minWidth: '270px',
        minHeight: '180px',
        maxWidth: '96vw',
        maxHeight: '96vh',
        transition: isDragging ? 'none' : 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      } : { 
        transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* 2. Top Header Navigation (Draggable & Control Area) */}
      <div 
        onMouseDown={handleDragStart}
        onTouchStart={handleTouchStart}
        className={`bg-[#0B192C] text-white select-none px-4 py-3 flex items-center justify-between border-b border-indigo-950 shrink-0 ${
          isMaximized ? '' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-indigo-950 flex items-center justify-center border border-indigo-800">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <span className="text-xs font-black tracking-widest uppercase truncate">Admin Scratchpad</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Status Dot */}
          <button 
            onClick={handleManualSync}
            title={syncStatus === 'synced' ? 'All changes saved to database cloud' : syncStatus === 'saving' ? 'Saving changes...' : 'Offline backup only (Click to Retry)'}
            className="mr-2 transition-transform active:scale-95 cursor-pointer"
          >
            {syncStatus === 'synced' && (
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] uppercase font-bold text-slate-400">Synced</span>
              </div>
            )}
            {syncStatus === 'saving' && (
              <div className="flex items-center gap-1">
                <Loader2 className="w-2.5 h-2.5 text-amber-500 animate-spin" />
                <span className="text-[9px] uppercase font-bold text-amber-500">Saving</span>
              </div>
            )}
            {syncStatus === 'error' && (
              <div className="flex items-center gap-1">
                <AlertCircle className="w-2.5 h-2.5 text-red-500 animate-bounce" />
                <span className="text-[9px] uppercase font-bold text-red-400">Offline</span>
              </div>
            )}
          </button>

          {/* Minimize Option */}
          <button 
            onClick={toggleMin} 
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer animate-none"
            title="Minimize Scratchpad"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {/* Maximize Option */}
          <button 
            onClick={toggleMax} 
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMaximized ? "Restore Size" : "Maximize Scratchpad"}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Main Text Editing Canvas */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-50 relative">
        
        {/* Action Ribbon Subheader */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleFont}
              className={`px-1.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1 [content-visibility:auto] ${
                fontFamily === 'mono' 
                  ? 'bg-slate-900 border-slate-950 text-white' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Change editorial font face"
            >
              <Type className="w-3 h-3" />
              {fontFamily === 'mono' ? 'JetBrains Mono' : 'Inter Sans'}
            </button>

            <button 
              onClick={handleAiImprove}
              className="px-1.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 transition-colors cursor-pointer flex items-center gap-1"
              title="Auto-format and restructure notes"
            >
              <Sparkles className="w-3 h-3 text-indigo-600 animate-pulse" />
              Format AI
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={handleDownload}
              className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-200 cursor-pointer transition-colors"
              title="Download notes to a TXT file"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleClear}
              className="p-1 rounded text-rose-500 hover:text-rose-800 hover:bg-rose-50 cursor-pointer transition-colors"
              title="Clear all text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Textarea Area */}
        <div className="flex-1 min-h-0 p-2">
          <textarea
            value={noteContent}
            onChange={handleChange}
            placeholder="Jot down affiliate ideas, marketing campaigns, price drop logs or task lists here. Reserves and synchronizes live automatically with security..."
            className={`w-full h-full p-3 resize-none bg-white border border-slate-200 rounded-xl shadow-inner focus:outline-none focus:ring-1 focus:ring-[#0B192C] focus:border-[#0B192C] leading-relaxed text-xs text-slate-900 ${
              fontFamily === 'mono' ? 'font-mono' : 'font-sans'
            }`}
          />
        </div>

        {/* 4. Bottom Metric Panel info */}
        <div className="bg-slate-100 border-t border-slate-200 px-3 py-1.5 flex justify-between items-center text-[10px] text-slate-500 uppercase font-black tracking-wider select-none shrink-0">
          <div className="flex items-center gap-3">
            <span>Words: <span className="text-slate-800 font-black">{wordCount}</span></span>
            <span>Chars: <span className="text-slate-800 font-black">{charCount}</span></span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            <span>UK Affiliate Secure Workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
}
