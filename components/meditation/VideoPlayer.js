import React, { useRef, useEffect } from 'react';

const COMMON_VIDEO_URL = "https://bkstrapiapp.blob.core.windows.net/strapi-uploads/assets/Shiv_Baba_Experience_Now_Desktop_551d04cc0f.mp4";

const VideoPlayer = ({ isPlaying }) => {
  const videoRef = useRef(null);

  // Sync video playback with audio state
  useEffect(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.play().catch(err => {
        console.error('Error playing video:', err);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Prevent scrolling when video is shown
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <>
     
      
      {/* Video container */}
      <div className="fixed inset-0 bottom-[100px] bg-black z-[9999]">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={COMMON_VIDEO_URL}
          loop
          muted
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
};

export default VideoPlayer; 