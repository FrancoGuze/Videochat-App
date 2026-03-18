import { useEffect, useRef, useState } from "react";
import type { MediaState } from "../types/media";

export const useLocalMedia = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [localMediaState, setLocalMediaState] = useState<MediaState>({
    audio: true,
    video: true,
  });

  useEffect(() => {
    const setVideoRef = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          if (videoRef.current.srcObject instanceof MediaStream) {
            const audioTrack = videoRef.current.srcObject.getAudioTracks()[0];
            audioTrack.enabled = true;

            const videoTrack = videoRef.current.srcObject.getVideoTracks()[0];
            videoTrack.enabled = true;
            setLocalMediaState({
              audio: audioTrack.enabled,
              video: videoTrack.enabled,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    setVideoRef();

    return () => {
      if (videoRef.current?.srcObject instanceof MediaStream) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  return { videoRef, localMediaState, setLocalMediaState };
};
