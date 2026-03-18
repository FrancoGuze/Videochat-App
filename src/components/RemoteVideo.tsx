import { useEffect, useRef, useState } from "react";
import type { MediaState } from "../types/media";

export const RemoteVideo = ({
  user,
  stream,
  remoteMediaStates,
}: {
  user: string;
  stream: MediaStream;
  remoteMediaStates: MediaState;
}) => {
  const [userColor, setUserColor] = useState<string>("");
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setUserColor(
      `${Math.round(Math.random() * 255)},${Math.round(
        Math.random() * 255
      )},${Math.round(Math.random() * 255)}`
    );
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  const initials = user.slice(0, 1).toUpperCase();
  const isDark =
    userColor.split(",").reduce((acc, curr) => acc + Number(curr), 0) < 110;

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-shadow-grey-700 bg-shadow-grey-900">
      <video
        ref={ref}
        autoPlay
        playsInline
        muted={!remoteMediaStates.audio}
        className={`absolute inset-0 h-full w-full object-cover ${
          remoteMediaStates.video ? "opacity-100" : "opacity-0"
        }`}
      />
      {!remoteMediaStates.video && (
        <div
          style={{ backgroundColor: `rgb(${userColor})` }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            style={{
              backgroundColor: `oklch(from rgb(${userColor}) calc(l * 0.85) c h)`,
              color: isDark
                ? `oklch(from rgb(${userColor}) calc(l * 2.25) c h)`
                : `oklch(from rgb(${userColor}) calc(l * 0.5) c h)`,
            }}
            className="h-16 w-16 rounded-full flex items-center justify-center text-xl font-semibold"
          >
            {initials}
          </div>
        </div>
      )}
      <div className="absolute top-3 left-3 rounded-full bg-shadow-grey-950/70 px-3 py-1 text-xs text-porcelain-50">
        {user}
      </div>
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
            remoteMediaStates.audio
              ? "bg-porcelain-50/90 text-shadow-grey-900"
              : "bg-flag-red-500/80 text-shadow-grey-950"
          }`}
        >
          {remoteMediaStates.audio ? "Mic on" : "Muted"}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
            remoteMediaStates.video
              ? "bg-porcelain-50/90 text-shadow-grey-900"
              : "bg-flag-red-500/80 text-shadow-grey-950"
          }`}
        >
          {remoteMediaStates.video ? "Cam on" : "Cam off"}
        </span>
      </div>
    </div>
  );
};