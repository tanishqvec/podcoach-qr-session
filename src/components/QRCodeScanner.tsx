
import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

interface QRCodeScannerProps {
  onClose: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const handleScan = (data: { text: string } | null) => {
    if (data && data.text) {
      console.log('QR code scanned:', data.text);
      // If the scanned data is a URL, redirect to it
      if (data.text.startsWith('http')) {
        window.location.href = data.text;
      } else {
        window.open(data.text, '_blank');
      }
    }
  };

  const handleError = (err: Error) => {
    console.error('QR Scanner error:', err);
    setError('Error accessing camera. Please ensure camera permissions are granted.');
  };

  const toggleCamera = () => {
    setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
  };

  return (
    <Card className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="w-full max-w-md mx-auto mb-4">
        <h2 className="text-xl font-bold text-white mb-2 text-center">Scan QR Code</h2>
        <p className="text-white/70 text-center mb-4">Position the QR code in the camera view</p>
      </div>
      
      <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden border-2 border-primary">
        <QrScanner
          delay={300}
          onError={handleError}
          onScan={handleScan}
          constraints={{
            video: { facingMode },
            audio: false,
          }}
          style={{ width: '100%', height: '100%' }}
        />
        {/* Overlay to highlight scanning area */}
        <div className="absolute inset-0 border-[20px] border-black/50 pointer-events-none">
          <div className="absolute inset-0 border-2 border-white/30"></div>
        </div>
      </div>
      
      {error && (
        <p className="text-red-500 mt-4 text-center">{error}</p>
      )}
      
      <div className="mt-6">
        <Button onClick={toggleCamera} className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
          Switch Camera ({facingMode === 'environment' ? 'Front' : 'Back'})
        </Button>
      </div>
    </Card>
  );
};

export default QRCodeScanner;
