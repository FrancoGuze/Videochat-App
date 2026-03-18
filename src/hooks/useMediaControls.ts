import { useCallback } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import { socket } from "../services/socket";
import type { MediaState } from "../types/media";

type Params = {
  videoRef: RefObject<HTMLVideoElement | null>;
  localMediaState: MediaState;
  setLocalMediaState: Dispatch<SetStateAction<MediaState>>;
  room?: string;
  userId?: string;
};

export const useMediaControls = ({
  videoRef,
  localMediaState,
  setLocalMediaState,
  room,
  userId,
}: Params) => {
  const toggleAudio = useCallback(() => {
    if (videoRef.current?.srcObject instanceof MediaStream) {
      const audioTrack = videoRef.current.srcObject.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      const nextState = {
        ...localMediaState,
        audio: audioTrack.enabled,
      };
      setLocalMediaState(nextState);

      if (room && userId) {
        socket.emit("media-update", { room, user: userId, state: nextState });
      }
    }
  }, [localMediaState, room, userId, setLocalMediaState, videoRef]);

  const toggleVideo = useCallback(() => {
    if (videoRef.current?.srcObject instanceof MediaStream) {
      const videoTrack = videoRef.current.srcObject.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      const nextState = {
        ...localMediaState,
        video: videoTrack.enabled,
      };
      setLocalMediaState(nextState);

      if (room && userId) {
        socket.emit("media-update", { room, user: userId, state: nextState });
      }
    }
  }, [localMediaState, room, userId, setLocalMediaState, videoRef]);

  return { toggleAudio, toggleVideo };
};
