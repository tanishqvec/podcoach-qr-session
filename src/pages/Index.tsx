
import { Button } from "@/components/ui/button";
import ScanQRButton from "@/components/ScanQRButton";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-white">QR Code Scanner App</h1>
        <p className="text-xl text-gray-300">Scan QR codes and open the links directly</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/10 shadow-xl">
          <h2 className="text-lg font-medium text-white mb-4 text-center">Ready to scan?</h2>
          <ScanQRButton size="lg" className="w-full py-6" />
        </div>
        
        <div className="text-gray-400 text-sm max-w-md text-center mt-6 px-4">
          <p>Point your camera at any QR code to scan it and be redirected to the corresponding website or content.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
