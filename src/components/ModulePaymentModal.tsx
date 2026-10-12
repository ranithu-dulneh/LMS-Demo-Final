import React, { useState } from 'react';
import { X, Upload, CreditCard, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export interface UnlockedModule {
  id: string;
  batch: string;
  title: string;
  month: string;
  priceLKR: number;
  description: string;
  isUnlocked: boolean;
  videoCount: number;
  tuteCount: number;
}

interface ModulePaymentModalProps {
  module: UnlockedModule | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessUnlock: (moduleId: string) => void;
}

export const ModulePaymentModal: React.FC<ModulePaymentModalProps> = ({
  module,
  isOpen,
  onClose,
  onSuccessUnlock
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'payslip' | 'online' | null>(null);
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen || !module) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccessUnlock(module.id);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-[32px] border border-slate-200 shadow-2xl p-6 sm:p-8 text-center space-y-6">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title matching Screenshot 2026-10-07 at 00.09.28.png */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
            {module.title}
          </h3>

          <div className="w-full h-px bg-slate-200/80 my-4" />

          {/* Price Tag in Bold Red/Coral matching screenshot */}
          <div className="text-2xl sm:text-3xl font-black text-rose-600 font-sans tracking-tight">
            Rs. {module.priceLKR.toFixed(2)}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto text-left sm:text-center">
            {module.description}
          </p>
        </div>

        {/* Action Buttons matching Screenshot 00.09.28: [ Payslip ] and [ Pay Online ] */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">

          <button
            onClick={() => {
              setSelectedMethod('payslip');
              setFileUploaded(true);
            }}
            className={`w-full sm:w-1/2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              selectedMethod === 'payslip'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-emerald-800 text-white hover:bg-emerald-700'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{fileUploaded ? 'Payslip Attached ✓' : 'Payslip'}</span>
          </button>

          <button
            onClick={() => setSelectedMethod('online')}
            className={`w-full sm:w-1/2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              selectedMethod === 'online'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-emerald-700 text-white hover:bg-emerald-600'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Pay Online</span>
          </button>

        </div>

        {/* Payment Confirmation Drawer */}
        {selectedMethod && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
            <span className="text-xs font-bold text-slate-800">
              {selectedMethod === 'payslip' ? 'Bank Deposit / Slip Verification' : 'Instant Online Gateway'}
            </span>
            <p className="text-[11px] text-slate-500">
              Commercial Bank of Ceylon · A/C: 1000849201 · Account: Inspire Education
            </p>

            <button
              onClick={handleSimulatePayment}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Unlocking Module...' : 'Confirm & Unlock Lesson Now'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
