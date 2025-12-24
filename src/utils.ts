import type { Dispatch, RefObject, SetStateAction } from "react";
import { socket } from "./socket";

export type MediaState = {
  audio: boolean;
  video: boolean;
};

export const mediaObj = {
  pauseAudio: (
    videoRef: RefObject<HTMLVideoElement | null>,
    media: MediaState,
    mediaSetter: Dispatch<SetStateAction<MediaState>>,
    room?: string,
    user?: string
  ) => {
    console.log("Update audio state from local to remote");
    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
      const audio: MediaStreamTrack =
        videoRef.current.srcObject.getAudioTracks()[0];
      // console.log(audio);
      audio.enabled = !audio.enabled;
      const newState = {
        ...media,
        audio: audio.enabled,
      };
      console.log("New local-mmedia: ", newState);
      mediaSetter(newState);

      // console.log("Props needed to notify", {
      //   room,
      //   user,
      //   audio: audio.enabled,
      // });
      if (room && user) {
        socket.emit("media-update", { room, user, state: newState });
      }
    }
  },
  pauseVideo: (
    videoRef: RefObject<HTMLVideoElement | null>,
    media: MediaState,
    mediaSetter: Dispatch<SetStateAction<MediaState>>,
    room?: string,
    user?: string
  ) => {
    console.log("Update video state from local to remote");
    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
      const video: MediaStreamTrack =
        videoRef.current.srcObject.getVideoTracks()[0];
      video.enabled = !video.enabled;

      const newState = {
        ...media,
        video: video.enabled,
      };
      console.log("New local-mmedia: ", newState);

      mediaSetter(newState);

      // console.log("Props needed to notify", {
      //   room,
      //   user,
      //   newState,
      // });
      if (room && user) {
        socket.emit("media-update", { room, user, state: newState });
      }
    }
  },
  config: {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  },
};
