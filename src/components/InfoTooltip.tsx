import { useEffect, useId, useRef, useState } from 'react';

interface InfoTooltipProps {
  label: string;
  content: string;
}

export function InfoTooltip({ label, content }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <span
      ref={containerRef}
      className="relative inline-flex items-center align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border border-slate-400 text-[11px] font-semibold leading-none text-slate-600 transition-colors hover:border-slate-700 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D7A5F]"
      >
        i
      </button>

      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-slate-900 px-3 py-2.5 text-left text-xs font-normal leading-relaxed text-slate-100 shadow-lg"
        >
          {content}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-full -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900"
          />
        </span>
      )}
    </span>
  );
}
