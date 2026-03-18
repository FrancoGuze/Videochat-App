import { type RefObject } from "react";
import type { MediaState } from "../types/media";

export const MainVideo = ({
  localRef,
  localMediaState,
}: {
  localRef: RefObject<HTMLVideoElement | null>;
  localMediaState: MediaState;
}) => {
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-shadow-grey-700 bg-shadow-grey-900">
      <video
        id="local-video"
        ref={localRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />
      {!localMediaState.video && (
        <div className="absolute inset-0 flex items-center justify-center bg-shadow-grey-900">
          <div className="h-16 w-16 rounded-full bg-shadow-grey-700 text-porcelain-50 flex items-center justify-center text-xl font-semibold">
            You
          </div>
        </div>
      )}
      <div className="absolute top-3 left-3 rounded-full bg-shadow-grey-950/70 px-3 py-1 text-xs text-porcelain-50">
        You
      </div>
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
            localMediaState.audio
              ? "bg-porcelain-50/90 text-shadow-grey-900"
              : "bg-flag-red-500/80 text-shadow-grey-950"
          }`}
        >
          {localMediaState.audio ? "Mic on" : "Muted"}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
            localMediaState.video
              ? "bg-porcelain-50/90 text-shadow-grey-900"
              : "bg-flag-red-500/80 text-shadow-grey-950"
          }`}
        >
          {localMediaState.video ? "Cam on" : "Cam off"}
        </span>
      </div>
    </div>
  );
};