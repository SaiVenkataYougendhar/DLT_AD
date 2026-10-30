import { AlertTriangle, Check, LoaderCircle, RefreshCw, Search, Trash2, UploadCloud } from 'lucide-react';
import type { ReactNode } from 'react';

export function Button({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  testId,
}: {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'sapphire-subtle';
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  testId?: string;
}) {
  const styles = {
    primary: 'bg-primary text-primary-foreground hover:brightness-105 shadow-sm active:scale-[.98]',
    secondary: 'border border-border bg-card text-foreground hover:bg-muted/70 active:scale-[.98]',
    ghost: 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
    danger: 'border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/15',
    'sapphire-subtle': 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${styles[variant]} ${className}`}
      data-testid={testId}
    >
      {children}
    </button>
  );
}

export function LoadingState({ label = 'Querying CortexAI neural engine...' }: { label?: string }) {
  return (
    <div className="panel flex min-h-[200px] flex-col items-center justify-center gap-3 text-xs text-muted-foreground">
      <LoaderCircle size={22} className="animate-spin text-primary" />
      <span className="mono">{label}</span>
    </div>
  );
}

export function ErrorState({
  message = 'Telemetry endpoint currently unreachable.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="panel flex min-h-[200px] items-center justify-center px-6 text-center">
      <div>
        <AlertTriangle size={24} className="mx-auto mb-2 text-destructive" />
        <p className="text-sm font-semibold">Service Temporarily Unavailable</p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">{message}</p>
        {onRetry && (
          <Button variant="secondary" className="mt-4" onClick={onRetry} testId="button-retry">
            <RefreshCw size={13} />
            Retry Connection
          </Button>
        )}
      </div>
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search scans by filename, prediction ID, or date...',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="relative block">
      <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-xs outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground/60 text-foreground"
        data-testid="input-search"
      />
    </label>
  );
}

export function SectionLabel({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="eyebrow text-muted-foreground">{children}</div>
      {right}
    </div>
  );
}

export function ConfirmDelete({ onConfirm, busy }: { onConfirm: () => void; busy?: boolean }) {
  return (
    <Button
      variant="danger"
      onClick={() => {
        if (window.confirm('Delete this stored scan prediction record?')) onConfirm();
      }}
      disabled={busy}
      testId="button-delete-prediction"
      className="px-2.5 py-1.5"
    >
      {busy ? <LoaderCircle size={13} className="animate-spin" /> : <Trash2 size={13} />}
      <span className="hidden sm:inline">Delete</span>
    </Button>
  );
}

export function UploadGlyph() {
  return (
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      <UploadCloud size={28} strokeWidth={1.75} />
    </div>
  );
}

export function CheckMark() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
      <Check size={12} strokeWidth={2.5} />
    </span>
  );
}
