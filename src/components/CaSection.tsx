import { useState } from 'react';
import { Calculator, FileSpreadsheet } from 'lucide-react';
import { FriendPhoto, pickPhotosByIds } from '../utils/photoStore';
import { FriendPhotoFrame } from './FriendPhotoFrame';
import { soundEngine } from '../utils/soundEngine';

interface CaSectionProps {
  friendName: string;
  photos: FriendPhoto[];
  onOpenVault: () => void;
  onSelectLightbox: (photo: FriendPhoto) => void;
}

const LEDGER_ROWS = [
  {
    code: '1010',
    category: 'ASSETS',
    entry: 'ASSETS: INFINITE MEMORIES',
    value: '₹99,99,99,999',
    note: 'Appreciates every single year',
  },
  {
    code: '2040',
    category: 'LIABILITIES',
    entry: 'LIABILITIES: TOO MANY BIRTHDAY EXPENSES',
    value: '(₹4,20,000)',
    note: 'Treat overdue to best friends',
  },
  {
    code: '3001',
    category: 'EQUITY',
    entry: 'CAPITAL: PURE LEGEND ENERGY',
    value: 'UNLIMITED',
    note: 'Non-dilutable founder equity',
  },
  {
    code: '9999',
    category: 'OPINION',
    entry: 'AUDIT RESULT: 100% ORIGINAL CHARACTER',
    value: 'PASSED',
    note: 'Zero fraud · Maximum madness',
  },
];

const FUNNY_PRESETS = [
  { label: 'Audit Madness', result: 'ERROR: OFF THE CHARTS' },
  { label: 'Birthday ROI', result: '+1,000,000% HAPPINESS' },
  { label: 'Party Budget', result: 'FRIEND PAYS = ₹0 FOR US' },
  { label: 'CA Sleep Hrs', result: '4.04 HRS FOUND' },
];

export function CaSection({
  friendName,
  photos,
  onOpenVault,
  onSelectLightbox,
}: CaSectionProps) {
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcSubline, setCalcSubline] = useState('READY TO AUDIT');
  const sectionPhotos = pickPhotosByIds(photos, ['kushal-06', 'kushal-36'], 23);

  const handleKeyPress = (val: string) => {
    soundEngine.playBrickSnap();
    if (val === 'C') {
      setCalcDisplay('0');
      setCalcSubline('CLEARED');
      return;
    }
    if (val === '=') {
      try {
        const sanitized = calcDisplay.replace(/[^0-9+\-*/.]/g, '');
        if (!sanitized) return;
        const evaluated = Function(`"use strict"; return (${sanitized})`)();
        if (typeof evaluated === 'number' && Number.isFinite(evaluated)) {
          const rounded = Number(evaluated.toFixed(6));
          setCalcDisplay(String(rounded));
          setCalcSubline('VERIFIED BY CA AUDIT');
        } else {
          setCalcDisplay('UNDEFINED');
          setCalcSubline('CA BALANCE ERROR');
        }
      } catch {
        setCalcDisplay('LEGEND');
        setCalcSubline('NON-NUMERIC GENIUS');
      }
      return;
    }
    setCalcDisplay((prev) => {
      if (
        prev === '0' ||
        prev === 'LEGEND' ||
        prev === 'UNDEFINED' ||
        prev.includes('ERROR') ||
        prev.includes('%') ||
        prev.includes('₹') ||
        prev.includes('HRS')
      ) {
        return val;
      }
      if (prev.length >= 18) return prev;
      return `${prev}${val}`;
    });
  };

  return (
    <section
      id="ca-ledger"
      className="relative py-20 lg:py-28 px-6 bg-[#0B1218] overflow-hidden border-b border-white/10"
    >
      <div className="max-w-[1200px] mx-auto space-y-12">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.22em] text-emerald-400 uppercase">
            <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
            <span>Annual Balance Sheet · Statutory Audit</span>
          </div>
          <h2
            className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white"
            style={{ textWrap: 'balance' }}
          >
            CA BY PROFESSION. LEGEND BY NATURE.
          </h2>
          <p className="text-slate-300 text-base leading-relaxed">
            Somehow balancing brutal CA articleship &amp; exam marathons while
            still showing up for every crazy plan. Let&apos;s inspect the
            official birthday balance sheet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Excel-Inspired Balance Sheet */}
          <div className="lg:col-span-7 rounded-xl overflow-hidden border border-emerald-500/35 bg-[#080E14] shadow-xl">
            {/* Formula Bar */}
            <div className="px-4 py-2.5 bg-[#0D1A15] border-b border-emerald-500/25 flex items-center gap-3 font-mono text-xs">
              <span className="text-emerald-400 font-bold">fx</span>
              <span className="text-slate-300 truncate">
                =SUM(FRIENDSHIP, CHAOS, LONG_DRIVES) * &quot;{friendName}&quot;
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#111B24] text-slate-400 border-b border-white/10">
                    <th className="py-3 px-4 font-medium">ACCT</th>
                    <th className="py-3 px-4 font-medium">LEDGER ENTRY</th>
                    <th className="py-3 px-4 font-medium text-right">VALUE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {LEDGER_ROWS.map((row) => (
                    <tr
                      key={row.code}
                      className="hover:bg-emerald-500/5 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-slate-500 tabular-nums">
                        {row.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">
                          {row.entry}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {row.note}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-400 tabular-nums whitespace-nowrap">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Audit Evidence Photos */}
            <div className="p-4 border-t border-white/10 bg-[#0A1118] grid grid-cols-2 gap-4">
              {sectionPhotos.map((photo, idx) => (
                <div
                  key={photo ? photo.id : idx}
                  className="border border-emerald-500/30 rounded-lg overflow-hidden bg-black"
                >
                  <div className="px-2.5 py-1.5 bg-[#0D1A15] font-mono text-[10px] text-emerald-300 flex justify-between">
                    <span>EXHIBIT {idx === 0 ? 'A' : 'B'}</span>
                    <span>SIGNED</span>
                  </div>
                  <div className="aspect-[4/3]">
                    <FriendPhotoFrame
                      photo={photo}
                      onOpenVault={onOpenVault}
                      onSelectLightbox={onSelectLightbox}
                      slotLabel={`Audit Exhibit ${idx === 0 ? 'A' : 'B'}`}
                      accentColor="#10B981"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Funny Animated CA Calculator */}
          <div className="lg:col-span-5 bg-[#101822] border border-white/15 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                <span>CA Birthday Calculator</span>
              </div>
              <span className="font-mono text-[11px] text-slate-400">
                12-DIGIT TAX SPEC
              </span>
            </div>

            {/* LCD Screen */}
            <div className="p-4 rounded-lg bg-[#16271F] border border-emerald-500/35 text-right space-y-1">
              <div className="font-mono text-[10px] text-emerald-300 tracking-wider">
                {calcSubline}
              </div>
              <div className="font-mono tabular-nums text-xl sm:text-2xl font-bold text-emerald-100 truncate">
                {calcDisplay}
              </div>
            </div>

            {/* Funny Quick Audit Presets */}
            <div className="grid grid-cols-2 gap-2">
              {FUNNY_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    soundEngine.playLevelUpChord();
                    setCalcSubline(preset.label.toUpperCase());
                    setCalcDisplay(preset.result);
                  }}
                  className="py-2 px-3 min-h-[40px] rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 font-mono text-[11px] font-semibold text-emerald-300 transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Working Numeric Keypad */}
            <div className="grid grid-cols-4 gap-2 font-mono text-sm">
              {[
                '7', '8', '9', '/',
                '4', '5', '6', '*',
                '1', '2', '3', '-',
                'C', '0', '=', '+',
              ].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeyPress(key)}
                  className={`py-3 min-h-[44px] rounded-md font-bold transition-colors cursor-pointer ${
                    key === '='
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                      : key === 'C'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
                        : 'bg-white/5 text-white border border-white/10 hover:bg-white/15'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
