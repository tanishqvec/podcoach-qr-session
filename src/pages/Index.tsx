import { Button } from "@/components/ui/button";
import ScanQRButton from "@/components/ScanQRButton";
import { QrCode } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">AI Calendar</h1>
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* QR Section */}
        <div className="flex flex-col items-center mb-8">
          <a href="/session" title="Click to go to session">
            <img
              src="/qr.png"
              alt="Scan this QR to join the session"
              className="w-40 h-40 rounded-lg border-4 border-white shadow-lg hover:scale-105 transition-transform cursor-pointer"
            />
          </a>
          <div className="text-white/80 text-sm mt-2 text-center max-w-xs">
            Scan this QR code with your phone, or click it to go directly to the session page.
          </div>
        </div>
        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/10 shadow-xl">
          <h2 className="text-lg font-medium text-white mb-4 text-center">Scan a QR code or start directly</h2>
          
          <div className="flex flex-col gap-4">
            <ScanQRButton size="lg" className="w-full py-6" />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/70 px-2 text-white/60">or</span>
              </div>
            </div>
            
            <Link to="/session">
              <Button variant="secondary" size="lg" className="w-full">
                <QrCode className="mr-2 h-4 w-4" />
                Go to Session Directly
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="text-gray-400 text-sm max-w-md text-center mt-6 px-4">
        </div>
      </div>
    </div>
  );
};

export default Index;
