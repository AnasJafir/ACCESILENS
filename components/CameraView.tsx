import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { UI_LABELS } from '../constants';
import { Language } from '../types';

export interface CameraHandle {
  capture: () => string | null;
}

interface CameraViewProps {
  isActive: boolean;
  language: Language;
}

const CameraView = forwardRef<CameraHandle, CameraViewProps>(({ isActive, language }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');
  const t = UI_LABELS[language];

  useImperativeHandle(ref, () => ({
    capture: () => {
      if (!videoRef.current || !canvasRef.current) return null;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Ensure video has data
      if (video.videoWidth === 0 || video.videoHeight === 0) return null;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      ctx.drawImage(video, 0, 0);
      return canvas.toDataURL('image/jpeg', 0.7);
    }
  }));

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Use back camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
          setError('');
        }
      } catch (err) {
        console.error("Camera error:", err);
        setHasPermission(false);
        setError(t.cameraError);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [language]); 

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden flex items-center justify-center">
      {hasPermission === false ? (
        <div className="text-center p-6 bg-red-900/50 rounded-xl border-2 border-red-500">
          <CameraOff className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <p className="text-xl font-bold text-white">{error}</p>
          <p className="mt-2 text-gray-300">{t.cameraPermission}</p>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40 grayscale'}`}
        />
      )}
      
      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Overlay status for accessibility visual */}
      {!isActive && hasPermission && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <p className="text-2xl font-bold text-white uppercase tracking-wider border-4 border-white p-4">{t.pause}</p>
        </div>
      )}
    </div>
  );
});

CameraView.displayName = 'CameraView';

export default CameraView;