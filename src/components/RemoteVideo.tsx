import { useEffect, useRef, useState } from "react";
import { mediaObj, type MediaState } from "../utils";

export const RemoteVideo = ({
  user,
  stream,
  room,
  remoteMediaStates,
}: {
  user: string;
  stream: MediaStream;
  room: string;
  remoteMediaStates: MediaState;
}) => {
  const [userColor,setuserColor] = useState<string>(`${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)}`)
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  //TEMA CON EL STREAM DE VIDEO REMOTO A SOLUCIONAR
  return (
    <div>
      <div className="relative h-20 w-48">
        <video
          ref={ref}
          autoPlay
          playsInline
          muted={!remoteMediaStates.audio}
          className={`h-auto w-48 aspect-video object-cover absolute border-4 rounded-2xl ${
            remoteMediaStates.video ? "z-10" : "-z-10"
          }`}
        />
        {!remoteMediaStates.video && (
          <div style={{backgroundColor:`rgb(${userColor})`}}
            className={`h-auto w-48 aspect-video absolute border-4 rounded-2xl flex items-center justify-center ${
              !remoteMediaStates.video ? "z-10" : "-z-10"
            }`}
          > 
          <div style={{backgroundColor:`oklch(from rgb(${userColor}) calc(l * 0.85) c h)`}} className="h-9 w-9 text-xl font-bold aspect-square flex items-center justify-center rounded-full ">{user.slice(0,1)}</div>
          </div>
        )}
      </div>
    </div>
  );
};
