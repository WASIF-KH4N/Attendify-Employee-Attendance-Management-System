import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const PwaInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const dismissed = localStorage.getItem('pwa-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSince = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSince < 3) return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      setIsInstalled(true);
      setShowBanner(false);
    };
    window.addEventListener('appinstalled', handler);
    return () => window.removeEventListener('appinstalled', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-dismissed', Date.now().toString());
  };

  if (isInstalled || !showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-20 lg:pb-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xl">A</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800">Install AttendPro</p>
          <p className="text-xs text-slate-500 truncate">Add to home screen for quick access</p>
        </div>
        <button
          onClick={handleInstall}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shrink-0 transition-colors"
        >
          Install
        </button>
        <button onClick={handleDismiss} className="p-1.5 text-slate-400 hover:text-slate-600 shrink-0">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default PwaInstallBanner;
