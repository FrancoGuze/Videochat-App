import type { Dispatch, RefObject, SetStateAction } from "react";
export const mediaObj = {
  pauseAudio: (
    videoRef: RefObject<HTMLVideoElement | null>,
    audioSetter: Dispatch<SetStateAction<boolean>>
  ) => {
    console.log("Function start");
    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
      const audio: MediaStreamTrack =
        videoRef.current.srcObject.getAudioTracks()[0];
      console.log(audio);
      audio.enabled = !audio.enabled;
      audioSetter(audio.enabled);
    }
  },
  pauseVideo: (
    videoRef: RefObject<HTMLVideoElement | null>,
    cameraSetter: Dispatch<SetStateAction<boolean>>
  ) => {
    console.log("Function start");
    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
      const video: MediaStreamTrack =
        videoRef.current.srcObject.getVideoTracks()[0];
      console.log(video);
      video.enabled = !video.enabled;
      cameraSetter(video.enabled);
    }
  },
};

