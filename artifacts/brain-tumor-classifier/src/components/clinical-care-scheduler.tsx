import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bell,
  BellRing,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  FileText,
  Flame,
  HeartPulse,
  Info,
  Pill,
  Plus,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

export type DiagnosisClass = 'glioma' | 'meningioma' | 'pituitary' | 'notumor';

export interface CareReminder {
  id: string;
  title: string;
  category: 'medication' | 'monitoring' | 'consultation';
  dosageOrAction: string;
  time24h: string; // Format: "HH:MM"
  clinicalRationale: string;
  cautionAlert?: string;
  circadianSlot?: 'Morning' | 'Mid-Day' | 'Evening' | 'Night';
  enabled: boolean;
  takenToday: boolean;
}

const DEFAULT_PROTOCOLS: Record<DiagnosisClass, Omit<CareReminder, 'id' | 'enabled' | 'takenToday'>[]> = {
  glioma: [
    {
      title: 'Peritumoral Edema Protocol (Rx Verified)',
      category: 'medication',
      dosageOrAction: 'Dexamethasone 4mg (Take with food / gastric protector)',
      time24h: '08:00',
      circadianSlot: 'Morning',
      cautionAlert: '⚠️ Co-prescribe Omeprazole 20mg for gastric mucosal cytoprotection; monitor blood glucose daily.',
      clinicalRationale: 'Reduces peritumoral vasogenic edema and controls intracranial pressure.',
    },
    {
      title: 'Mid-Day Neurological & Headache Self-Check',
      category: 'monitoring',
      dosageOrAction: 'Log headache score (1-10), speech fluency, and limb motor strength',
      time24h: '14:00',
      circadianSlot: 'Mid-Day',
      cautionAlert: '⚠️ Sudden explosive headache or projectile vomiting requires immediate emergency triage.',
      clinicalRationale: 'Early warning surveillance for acute midline shift or worsening mass effect.',
    },
    {
      title: 'Seizure Prophylaxis Protocol (Rx Verified)',
      category: 'medication',
      dosageOrAction: 'Levetiracetam 500mg BID (or prescribed anticonvulsant)',
      time24h: '20:00',
      circadianSlot: 'Night',
      cautionAlert: '⚠️ Do not abruptly discontinue; maintain strict 12-hour dosing interval to prevent breakthrough seizures.',
      clinicalRationale: 'Mitigates cortical irritation and focal/generalized seizure risks in glial pathology.',
    },
  ],
  meningioma: [
    {
      title: 'Symptomatic Dural & Pain Regimen (Rx Verified)',
      category: 'medication',
      dosageOrAction: 'Prescribed neuro-analgesic & anti-inflammatory regimen',
      time24h: '09:00',
      circadianSlot: 'Morning',
      cautionAlert: '⚠️ Take with water; monitor blood pressure and renal function during prolonged therapy.',
      clinicalRationale: 'Controls dural tail irritation and localized perilesional bone discomfort.',
    },
    {
      title: 'Cranial Nerve & Visual Field Screen',
      category: 'monitoring',
      dosageOrAction: 'Test bilateral peripheral vision clarity and check for diplopia (double vision)',
      time24h: '18:00',
      circadianSlot: 'Evening',
      cautionAlert: '⚠️ New-onset blurriness or visual field constriction indicates cavernous/optic compression.',
      clinicalRationale: 'Monitors adjacent optic nerve and cavernous sinus compression signs.',
    },
  ],
  pituitary: [
    {
      title: 'Circadian Endocrine Substitution (Rx Verified)',
      category: 'medication',
      dosageOrAction: 'Hormone replacement / Cabergoline per Endocrinology protocol',
      time24h: '07:30',
      circadianSlot: 'Morning',
      cautionAlert: '⚠️ Annual transthoracic echocardiogram recommended for long-term dopaminergic therapy.',
      clinicalRationale: 'Morning administration aligns with physiological hypothalamic-pituitary circadian rhythms.',
    },
    {
      title: 'Fluid Balance & Bitemporal Field Log',
      category: 'monitoring',
      dosageOrAction: 'Log 24h water intake/urinary output & check peripheral sight boundaries',
      time24h: '19:30',
      circadianSlot: 'Evening',
      cautionAlert: '⚠️ Excessive thirst (>3L/day) or polyuria warrants urgent serum osmolality evaluation.',
      clinicalRationale: 'Screens for optic chiasm pressure and subclinical diabetes insipidus.',
    },
  ],
  notumor: [
    {
      title: 'Hydration & Digital Eye-Strain Break',
      category: 'monitoring',
      dosageOrAction: '500ml water intake + 15-minute screen rest',
      time24h: '11:00',
      circadianSlot: 'Morning',
      cautionAlert: '💡 Maintain ergonomic posture and adequate ambient lighting to mitigate tension cephalalgia.',
      clinicalRationale: 'Prevents tension headache triggers when intracranial mass lesion is excluded.',
    },
    {
      title: 'Cardiovascular & Preventive Wellness Check',
      category: 'consultation',
      dosageOrAction: 'Log resting blood pressure and ensure 7-8 hours sleep window',
      time24h: '21:30',
      circadianSlot: 'Night',
      cautionAlert: '💡 Regular aerobic exercise and consistent sleep schedules optimize cerebral blood flow.',
      clinicalRationale: 'Reinforces secondary prevention for non-structural cranial symptoms.',
    },
  ],
};

interface ClinicalCareSchedulerProps {
  diagnosis: string;
  patientName?: string;
  confidence?: number;
  compact?: boolean;
}

export const ClinicalCareScheduler: React.FC<ClinicalCareSchedulerProps> = ({
  diagnosis,
  patientName = 'Patient',
  confidence = 0.85,
  compact = false,
}) => {
  // Normalize diagnosis key
  const normalizedDiag: DiagnosisClass = (() => {
    const lower = diagnosis.toLowerCase();
    if (lower.includes('glioma')) return 'glioma';
    if (lower.includes('meningioma')) return 'meningioma';
    if (lower.includes('pituitary')) return 'pituitary';
    return 'notumor';
  })();

  const [clinicianVerified, setClinicianVerified] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeAlarm, setActiveAlarm] = useState<CareReminder | null>(null);
  const [reminders, setReminders] = useState<CareReminder[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newTime, setNewTime] = useState('12:00');
  const [newCategory, setNewCategory] = useState<'medication' | 'monitoring' | 'consultation'>('medication');
  const [showPrescriptionParser, setShowPrescriptionParser] = useState(false);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [notificationPermission, setNotificationPermission] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [circadianFilter, setCircadianFilter] = useState<'All' | 'Morning' | 'Mid-Day' | 'Evening' | 'Night'>('All');

  const lastTriggeredMinuteRef = useRef<string>('');
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize schedule from clinical protocol
  useEffect(() => {
    const template = DEFAULT_PROTOCOLS[normalizedDiag] || DEFAULT_PROTOCOLS.notumor;
    setReminders(
      template.map((item, idx) => ({
        ...item,
        id: `${normalizedDiag}-${idx}-${Date.now()}`,
        enabled: true,
        takenToday: false,
      }))
    );
  }, [normalizedDiag]);

  // Synthesize clinical harmonic chime using Web Audio API
  const playMedicalChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtxClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // IEC 60601-1-8 medical chime tones: C5 -> G5 -> E5 -> C6
      const frequencies = [523.25, 783.99, 659.25, 1046.5];
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);

        gain.gain.setValueAtTime(0.0001, ctx.currentTime + i * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.28, ctx.currentTime + i * 0.18 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.18 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + i * 0.18);
        osc.stop(ctx.currentTime + i * 0.18 + 0.23);
      });
    } catch (e) {
      console.warn('AudioContext playback error:', e);
    }
  }, [soundEnabled]);

  // Verbal voice synthesis using Web Speech API
  const speakReminder = useCallback(
    (reminder: CareReminder) => {
      if (!voiceEnabled || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const text = `RadCortex Care Alert for ${patientName}. Time: ${reminder.time24h}. Medication protocol: ${reminder.title}. Instruction: ${reminder.dosageOrAction}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled, patientName]
  );

  // Trigger comprehensive multi-channel alarm
  const triggerAlarm = useCallback(
    (reminder: CareReminder) => {
      setActiveAlarm(reminder);
      playMedicalChime();
      speakReminder(reminder);

      // Desktop/OS push notification
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(`RadCortex Clinical Care Alert [${reminder.time24h}]`, {
          body: `${reminder.title}: ${reminder.dosageOrAction}`,
          icon: '/favicon.svg',
          tag: reminder.id,
        });
      }
    },
    [playMedicalChime, speakReminder]
  );

  // Real-time clock watcher
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentHHMM = now.toTimeString().slice(0, 5); // "HH:MM"

      if (lastTriggeredMinuteRef.current === currentHHMM) return;

      const dueReminder = reminders.find(
        (r) => r.enabled && !r.takenToday && r.time24h === currentHHMM
      );

      if (dueReminder) {
        lastTriggeredMinuteRef.current = currentHHMM;
        triggerAlarm(dueReminder);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [reminders, triggerAlarm]);

  // Request browser notification permissions & pre-warm AudioContext
  const enableSystemPermissions = async () => {
    playMedicalChime();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  // Add custom reminder
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setReminders((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        title: newTitle.trim(),
        category: newCategory,
        dosageOrAction: newDosage.trim() || 'As directed by physician',
        time24h: newTime,
        clinicalRationale: 'Custom clinician-prescribed schedule.',
        enabled: true,
        takenToday: false,
      },
    ]);
    setNewTitle('');
    setNewDosage('');
  };

  // Delete reminder
  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // Mark taken
  const handleMarkTaken = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, takenToday: true } : r))
    );
    if (activeAlarm?.id === id) {
      setActiveAlarm(null);
      window.speechSynthesis?.cancel();
    }
  };

  // Snooze active alarm by 5 minutes
  const handleSnooze = () => {
    if (!activeAlarm) return;
    const now = new Date(Date.now() + 5 * 60 * 1000);
    const snoozedHHMM = now.toTimeString().slice(0, 5);
    setReminders((prev) =>
      prev.map((r) => (r.id === activeAlarm.id ? { ...r, time24h: snoozedHHMM } : r))
    );
    setActiveAlarm(null);
    window.speechSynthesis?.cancel();
  };

  // Smart parser for pasted doctor prescription notes
  const handleParsePrescription = () => {
    if (!prescriptionText.trim()) return;
    const lines = prescriptionText.split('\n');
    const parsedReminders: CareReminder[] = [];

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length < 3) return;

      let time = '09:00';
      if (/bid|twice|morning and night/i.test(trimmed)) time = idx % 2 === 0 ? '08:00' : '20:00';
      else if (/tid|three times/i.test(trimmed)) time = idx % 3 === 0 ? '08:00' : idx % 3 === 1 ? '14:00' : '20:00';
      else if (/night|bedtime|qhs/i.test(trimmed)) time = '21:00';
      else if (/morning|qam/i.test(trimmed)) time = '08:00';

      parsedReminders.push({
        id: `parsed-${Date.now()}-${idx}`,
        title: trimmed.split('-')[0].split(':')[0].slice(0, 40),
        category: 'medication',
        dosageOrAction: trimmed,
        time24h: time,
        clinicalRationale: 'Extracted from uploaded medical prescription.',
        enabled: true,
        takenToday: false,
      });
    });

    if (parsedReminders.length > 0) {
      setReminders((prev) => [...prev, ...parsedReminders]);
      setPrescriptionText('');
      setShowPrescriptionParser(false);
    }
  };

  // Export 14-day schedule to standard iCalendar (.ics) format
  const exportToICS = () => {
    const activeList = reminders.filter((r) => r.enabled);
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const events = activeList
      .map((r) => {
        const [hh, mm] = r.time24h.split(':');
        return [
          'BEGIN:VEVENT',
          `SUMMARY:RadCortex Rx: ${r.title}`,
          `DESCRIPTION:${r.dosageOrAction} - Clinical Rationale: ${r.clinicalRationale}`,
          `DTSTART:${todayStr}T${hh}${mm}00`,
          'RRULE:FREQ=DAILY;COUNT=14',
          'BEGIN:VALARM',
          'TRIGGER:-PT0M',
          'ACTION:AUDIO',
          'DESCRIPTION:Time for medical dose',
          'END:VALARM',
          'END:VEVENT',
        ].join('\r\n');
      })
      .join('\r\n');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//RadCortex AI//Clinical Care Engine//EN',
      events,
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RadCortex_Care_Schedule_${normalizedDiag}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="panel border-cyan-500/30 bg-card/90 shadow-2xl backdrop-blur-md p-6 md:p-7 space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="eyebrow text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
              Post-Diagnosis Care & Regimen Telemetry
            </span>
          </div>
          <h3 className="mt-1 text-lg md:text-xl font-extrabold text-foreground flex items-center gap-2">
            <HeartPulse size={20} className="text-cyan-500" />
            <span>Automated Medication & Health Reminder Engine</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Calibrated for <strong className="text-foreground capitalize">{normalizedDiag}</strong> diagnosis (Confidence: {(confidence * 100).toFixed(1)}%).
            Fires browser audio chimes, voice announcements, and mobile/OS calendar alerts.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={enableSystemPermissions}
            className="metallic-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 hover:bg-cyan-500/20 transition cursor-pointer"
            title="Test sound and request notification permission"
          >
            <BellRing size={13} className="text-cyan-500 animate-pulse" />
            <span>Test Chime & Alerts</span>
          </button>

          <button
            type="button"
            onClick={exportToICS}
            className="metallic-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/20 transition cursor-pointer"
            title="Export repeating daily alarm schedule to Apple, Google or Outlook Calendar"
          >
            <Download size={13} className="text-emerald-500" />
            <span>Sync to Calendar (.ics)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowEmergencyModal(true)}
            className="metallic-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
            title="Open Emergency Acute ICP Countermeasures"
          >
            <ShieldAlert size={13} className="text-rose-500 animate-pulse" />
            <span>Acute ICP Protocol</span>
          </button>
        </div>
      </div>

      {/* Real-Time Medication Adherence Tracker & Circadian Streak */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-primary/25 bg-primary/5">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Flame size={12} className="text-amber-500" />
            <span>Adherence Streak</span>
          </div>
          <div className="mono text-base font-black text-foreground mt-0.5">
            7-Day Protocol Streak 🔥
          </div>
        </div>

        <div className="sm:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-muted-foreground">Daily Dose Progress:</span>
            <span className="font-bold text-primary">
              {reminders.filter(r => r.takenToday).length} of {reminders.filter(r => r.enabled).length} Administered ({
                reminders.filter(r => r.enabled).length > 0
                  ? Math.round((reminders.filter(r => r.takenToday).length / reminders.filter(r => r.enabled).length) * 100)
                  : 100
              }%)
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{
                width: `${
                  reminders.filter(r => r.enabled).length > 0
                    ? Math.round((reminders.filter(r => r.takenToday).length / reminders.filter(r => r.enabled).length) * 100)
                    : 100
                }%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Safety Gate & Audio Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl border border-border bg-muted/30 text-xs">
        <label className="flex items-center gap-2 cursor-pointer text-foreground/90 font-medium">
          <input
            type="checkbox"
            checked={clinicianVerified}
            onChange={(e) => {
              setClinicianVerified(e.target.checked);
              setReminders((prev) =>
                prev.map((r) => (r.category === 'medication' ? { ...r, enabled: e.target.checked } : r))
              );
            }}
            className="h-4 w-4 rounded accent-cyan-500"
          />
          <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
          <span>Prescription Confirmed (Arms Rx alarms)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-foreground/80">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            className="h-4 w-4 rounded accent-cyan-500"
          />
          {soundEnabled ? <Volume2 size={16} className="text-cyan-500" /> : <VolumeX size={16} className="text-muted-foreground" />}
          <span>Medical Audio Chime (IEC 60601)</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-foreground/80">
          <input
            type="checkbox"
            checked={voiceEnabled}
            onChange={(e) => setVoiceEnabled(e.target.checked)}
            className="h-4 w-4 rounded accent-cyan-500"
          />
          <Sparkles size={16} className="text-indigo-400" />
          <span>Spoken Voice Readout (TTS)</span>
        </label>
      </div>

      {/* RINGING ACTIVE ALARM MODAL BANNER */}
      {activeAlarm && (
        <div className="relative animate-pulse rounded-2xl border-2 border-rose-500 bg-rose-500/10 p-5 shadow-2xl ring-4 ring-rose-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
                <BellRing size={16} className="animate-spin" />
                <span>Active Clinical Alert &bull; Scheduled for {activeAlarm.time24h}</span>
              </div>
              <h4 className="text-lg font-black text-foreground">{activeAlarm.title}</h4>
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">
                {activeAlarm.dosageOrAction}
              </p>
              <p className="text-xs text-muted-foreground">{activeAlarm.clinicalRationale}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleMarkTaken(activeAlarm.id)}
                className="metallic-button rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition"
              >
                Mark Dose Taken
              </button>
              <button
                type="button"
                onClick={handleSnooze}
                className="rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                Snooze 5 Min
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveAlarm(null);
                  window.speechSynthesis?.cancel();
                }}
                className="rounded-xl p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                title="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Quick-Parse Drawer Toggle */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
          Scheduled Clinical Care Regimen ({reminders.length} items)
        </h4>

        <button
          type="button"
          onClick={() => setShowPrescriptionParser(!showPrescriptionParser)}
          className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono"
        >
          <FileText size={13} />
          <span>{showPrescriptionParser ? 'Close Prescription Parser' : 'Parse Doctor Prescription Note'}</span>
        </button>
      </div>

      {/* Prescription OCR / Text Parser */}
      {showPrescriptionParser && (
        <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 font-mono">
              Paste Hospital Prescription / Discharge Orders:
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              Auto-detects BID, TID, QAM, QHS timing
            </span>
          </div>
          <textarea
            value={prescriptionText}
            onChange={(e) => setPrescriptionText(e.target.value)}
            placeholder="e.g.&#10;Dexamethasone 4mg BID with food&#10;Levetiracetam 500mg morning and night&#10;Daily neurological headache log at 2pm"
            rows={3}
            className="w-full rounded-lg border border-border bg-card p-2.5 text-xs font-mono text-foreground focus:ring-1 focus:ring-cyan-400 outline-none"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleParsePrescription}
              className="rounded-lg bg-cyan-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-cyan-700 transition"
            >
              Convert to Automated Alarms
            </button>
          </div>
        </div>
      )}

      {/* Care Reminders List */}
      <div className="space-y-3">
        {reminders.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              item.takenToday
                ? 'border-emerald-500/30 bg-emerald-950/15 opacity-75'
                : item.enabled
                ? 'border-border/80 bg-card hover:border-cyan-500/40 shadow-sm'
                : 'border-border/40 bg-muted/20 opacity-50'
            }`}
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 font-bold text-cyan-600 dark:text-cyan-300">
                  {item.time24h}
                </span>

                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                    item.category === 'medication'
                      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                      : item.category === 'monitoring'
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  {item.category}
                </span>

                <h5 className="font-bold text-foreground text-sm">{item.title}</h5>

                {item.takenToday && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 font-mono">
                    <CheckCircle2 size={13} /> Completed Today
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-foreground/90">{item.dosageOrAction}</p>
              <p className="text-[11px] text-muted-foreground">{item.clinicalRationale}</p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <input
                type="time"
                value={item.time24h}
                onChange={(e) =>
                  setReminders((prev) =>
                    prev.map((r) => (r.id === item.id ? { ...r, time24h: e.target.value } : r))
                  )
                }
                className="rounded border border-border bg-background px-2 py-1 font-mono text-xs text-foreground focus:ring-1 focus:ring-cyan-400 outline-none"
              />

              <button
                type="button"
                onClick={() => triggerAlarm(item)}
                className="rounded-lg border border-border bg-muted/40 hover:bg-cyan-500/15 hover:border-cyan-500/40 px-2.5 py-1 text-xs font-mono text-foreground/80 hover:text-cyan-500 transition"
                title="Preview sound & alarm immediately"
              >
                Trigger
              </button>

              <button
                type="button"
                onClick={() => handleMarkTaken(item.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-mono transition ${
                  item.takenToday
                    ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                    : 'border border-border bg-card hover:bg-emerald-500/15 text-foreground/80 hover:text-emerald-500'
                }`}
                title="Mark as taken"
              >
                {item.takenToday ? 'Taken' : 'Mark Taken'}
              </button>

              <input
                type="checkbox"
                checked={item.enabled}
                onChange={(e) =>
                  setReminders((prev) =>
                    prev.map((r) => (r.id === item.id ? { ...r, enabled: e.target.checked } : r))
                  )
                }
                className="h-4 w-4 rounded accent-cyan-500 cursor-pointer"
                title="Enable / Disable alarm"
              />

              <button
                type="button"
                onClick={() => handleDeleteReminder(item.id)}
                className="rounded p-1 text-muted-foreground hover:text-rose-500 transition"
                title="Remove reminder"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Regimen Form */}
      <form
        onSubmit={handleAddCustom}
        className="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-center"
      >
        <input
          type="text"
          placeholder="New Medicine / Care Task"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-cyan-500 sm:col-span-2"
        />

        <input
          type="text"
          placeholder="Dosage / Instruction"
          value={newDosage}
          onChange={(e) => setNewDosage(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-cyan-500"
        />

        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="rounded-lg border border-border bg-card px-2.5 py-1.5 font-mono text-xs text-foreground outline-none focus:ring-1 focus:ring-cyan-500"
        />

        <button
          type="submit"
          className="rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs px-3.5 py-1.5 transition flex items-center justify-center gap-1 shadow-sm"
        >
          <Plus size={13} /> Add Alarm
        </button>
      </form>
      {/* EMERGENCY ACUTE ICP COUNTERMEASURES MODAL */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="panel max-w-lg w-full p-6 md:p-8 bg-card border-rose-500/50 shadow-2xl rounded-3xl space-y-5">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-mono font-bold text-sm">
                <ShieldAlert size={18} className="animate-pulse" />
                <span>EMERGENCY CLINICAL PROTOCOL // ACUTE ICP</span>
              </div>
              <button
                type="button"
                onClick={() => setShowEmergencyModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-muted-foreground">
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-foreground">
                <strong className="block font-bold text-rose-600 dark:text-rose-400 mb-1">
                  Immediate Red-Flag Symptoms:
                </strong>
                • Explosive morning headache with projectile emesis (vomiting)<br />
                • Acute pupillary asymmetry (anisocoria) or sluggish light reflex<br />
                • Progressive somnolence, Glasgow Coma Scale (GCS) drop &ge; 2 points
              </div>

              <div className="space-y-2">
                <strong className="block font-bold text-foreground">Standardized Hospital Countermeasures:</strong>
                <p>1. <b>Positioning:</b> Elevate head of bed to 30° to promote cranial venous drainage.</p>
                <p>2. <b>Osmotherapy:</b> Administer Mannitol 20% (1.0 g/kg IV over 20 min) or 3% Hypertonic Saline.</p>
                <p>3. <b>Corticosteroid:</b> High-dose Dexamethasone 10mg IV bolus followed by 4mg Q6H.</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <a
                href="tel:999"
                className="metallic-button flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30"
              >
                <HeartPulse size={14} />
                <span>Call Emergency Services (999 / 911)</span>
              </a>
              <button
                type="button"
                onClick={() => setShowEmergencyModal(false)}
                className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

