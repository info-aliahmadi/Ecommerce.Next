'use client';

import { Ruler } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const SIZE_DATA = [
  { size: 'XS', chest: '32-34', waist: '24-26', hip: '34-36', length: '26-27' },
  { size: 'S', chest: '34-36', waist: '26-28', hip: '36-38', length: '27-28' },
  { size: 'M', chest: '36-38', waist: '28-30', hip: '38-40', length: '28-29' },
  { size: 'L', chest: '38-40', waist: '30-32', hip: '40-42', length: '29-30' },
  { size: 'XL', chest: '40-42', waist: '32-34', hip: '42-44', length: '30-31' },
  { size: 'XXL', chest: '42-44', waist: '34-36', hip: '44-46', length: '31-32' },
];

const MEASUREMENT_STEPS = [
  { num: 1, title: 'Chest', desc: 'Measure around the fullest part of your chest, keeping the tape horizontal.' },
  { num: 2, title: 'Waist', desc: 'Measure around your natural waistline, where you normally wear your pants.' },
  { num: 3, title: 'Hips', desc: 'Stand with feet together and measure around the fullest part of your hips.' },
];

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
}

export function SizeGuideModal({ open, onClose }: SizeGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto scrollbar-thin p-0">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-ecommerce-surface z-10 px-6 pt-6 pb-4 border-b border-ecommerce-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-ecommerce-text-primary">
              <div className="w-9 h-9 rounded-xl bg-ecommerce-teal/10 flex items-center justify-center">
                <Ruler size={18} className="text-ecommerce-teal" />
              </div>
              <div>
                <span className="text-lg font-bold">Size Guide</span>
                <p className="text-xs text-ecommerce-text-muted font-normal mt-0.5">Find your perfect fit</p>
              </div>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Size Chart Table */}
          <div className="rounded-xl border border-ecommerce-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ecommerce-surface-hover dark:bg-[#252836]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-ecommerce-text-muted uppercase tracking-wider">Size</th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-ecommerce-text-muted uppercase tracking-wider">Chest (in)</th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-ecommerce-text-muted uppercase tracking-wider">Waist (in)</th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-ecommerce-text-muted uppercase tracking-wider hidden sm:table-cell">Hip (in)</th>
                  <th className="text-center px-3 py-3 text-xs font-semibold text-ecommerce-text-muted uppercase tracking-wider">Length (in)</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_DATA.map((row, i) => (
                  <tr
                    key={row.size}
                    className={`border-t border-ecommerce-border transition-colors hover:bg-ecommerce-surface-hover/60 ${i % 2 === 1 ? 'bg-ecommerce-surface-hover/30 dark:bg-[#1a1d2e]/50' : ''}`}
                  >
                    <td className="px-4 py-2.5 font-semibold text-ecommerce-text-primary">{row.size}</td>
                    <td className="text-center px-3 py-2.5 text-ecommerce-text-secondary">{row.chest}</td>
                    <td className="text-center px-3 py-2.5 text-ecommerce-text-secondary">{row.waist}</td>
                    <td className="text-center px-3 py-2.5 text-ecommerce-text-secondary hidden sm:table-cell">{row.hip}</td>
                    <td className="text-center px-3 py-2.5 text-ecommerce-text-secondary">{row.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure */}
          <div>
            <h4 className="text-sm font-bold text-ecommerce-text-primary mb-3">How to Measure</h4>
            <div className="space-y-3">
              {MEASUREMENT_STEPS.map((step) => (
                <div key={step.num} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-ecommerce-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-ecommerce-teal">{step.num}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ecommerce-text-primary">{step.title}</p>
                    <p className="text-xs text-ecommerce-text-muted mt-0.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-ecommerce-amber/5 border border-ecommerce-amber/10">
            <span className="text-base shrink-0 mt-0.5">💡</span>
            <p className="text-xs text-ecommerce-text-secondary leading-relaxed">
              <span className="font-semibold text-ecommerce-text-primary">Pro tip:</span> When in between sizes, we recommend sizing up for a more comfortable fit.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}