import { type RefObject } from "react";

export const MainVideo = ({
  localRef,
  localMediaState,
}: {
  localRef: RefObject<HTMLVideoElement | null>;
  localMediaState: { [key: string]: boolean };
}) => {
  const userColor = "100,100,100";
  return (
    <div className="relative h-20 w-48">
      <video
        id="local-video"
        ref={localRef}
        autoPlay
        playsInline
        muted
        className={`absolute h-auto w-48 aspect-video object-cover rounded-2xl  border-4 transition-all duration-400 ${
          !localMediaState.video ? "block" : "block"
        }`}
        //   style={{"boxShadow":"0px 0px 3px 3px green"}}
      />
      {!localMediaState.video && (
        <div
          style={{ backgroundColor: `rgb(${userColor})` }}
          className={`h-auto w-48 aspect-video absolute border-4 rounded-2xl flex items-center justify-center ${
            !localMediaState.video ? "z-10" : "-z-10"
          }`}
        >
          <div
            style={{
              backgroundColor: `oklch(from rgb(${userColor}) calc(l * 0.85) c h)`,
            }}
            className="h-12 w-12 text-xl font-bold aspect-square flex items-center justify-center rounded-full "
          >
            You
          </div>
        </div>
      )}
    </div>
  );
};
