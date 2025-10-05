import React, { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { qrAPI } from '../../utils/api';
import { Camera, X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRScannerProps {
  onScanSuccess?: (result: any) => void;
  onClose?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const scannerElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const startScanning = () => {
    if (!scannerElementRef.current) return;

    setScanning(true);
    setScanResult(null);

    // Simple camera access for QR scanning
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        video.srcObject = stream;
        video.play();
        
        const scanFrame = () => {
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            context?.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
            if (imageData) {
              const code = jsQR(imageData.data, imageData.width, imageData.height);
              if (code) {
                setLoading(true);
                qrAPI.scanQR(code.data)
                  .then(response => {
                    setScanResult(response.data);
                    toast.success(`Attendance marked as ${response.data.status}`);
                    if (onScanSuccess) onScanSuccess(response.data);
                    stream.getTracks().forEach(track => track.stop());
                    setScanning(false);
                  })
                  .catch(error => {
                    toast.error(error.response?.data?.error || 'Failed to process QR code');
                  })
                  .finally(() => setLoading(false));
                return;
              }
            }
          }
          if (scanning) requestAnimationFrame(scanFrame);
        };
        
        document.getElementById('qr-scanner')?.appendChild(video);
        scanFrame();
      })
      .catch(error => {
        toast.error('Camera access denied');
        console.error('Camera error:', error);
      });

    // Scanner reference not needed with jsQR
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const resetScanner = () => {
    setScanResult(null);
    stopScanning();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          QR Code Scanner
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {!scanning && !scanResult && (
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <Camera className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to start scanning QR codes for attendance marking.
          </p>
          <button
            onClick={startScanning}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Start Scanning
          </button>
        </div>
      )}

      {scanning && (
        <div className="space-y-4">
          <div 
            id="qr-scanner" 
            ref={scannerElementRef}
            className="w-full"
          />
          
          {loading && (
            <div className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-600 dark:text-blue-400">Processing QR code...</span>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={stopScanning}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Stop Scanning
            </button>
          </div>
        </div>
      )}

      {scanResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <div className="text-center">
              <p className="font-medium text-green-800 dark:text-green-300">
                Attendance Marked Successfully!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {scanResult.student_name} - {scanResult.status}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Scan Details:</h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-medium">Student:</span> {scanResult.student_name}</p>
              <p><span className="font-medium">Student ID:</span> {scanResult.student_id}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                  scanResult.status === 'present' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : scanResult.status === 'late'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {scanResult.status}
                </span>
              </p>
              <p><span className="font-medium">Time:</span> {new Date().toLocaleTimeString()}</p>
            </div>
          </div>

          <button
            onClick={resetScanner}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Scan Another QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;