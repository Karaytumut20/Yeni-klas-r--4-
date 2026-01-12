'use client';

import { useState } from 'react';
import { BellRing, CheckCircle2 } from 'lucide-react';

export default function WaiterButton({ tableId }: { tableId: string }) {
  const [status, setStatus] = useState<'idle' | 'calling' | 'called'>('idle');

  const callWaiter = async () => {
    setStatus('calling');
    // Simüle edilmiş garson çağırma isteği
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStatus('called');

    setTimeout(() => setStatus('idle'), 5000);
  };

  if (status === 'called') {
    return (
      <div className="fixed z-50 p-4 text-white bg-green-500 rounded-full shadow-lg bottom-24 right-6 animate-bounce">
        <CheckCircle2 size={24} />
      </div>
    );
  }

  return (
    <button
      onClick={callWaiter}
      disabled={status === 'calling'}
      className="fixed z-50 p-4 transition-all duration-300 bg-white border-2 rounded-full shadow-lg bottom-24 right-6 border-primary text-primary hover:bg-primary hover:text-white group"
    >
      <BellRing className={status === 'calling' ? 'animate-spin' : 'group-hover:animate-swing'} size={24} />
    </button>
  );
}