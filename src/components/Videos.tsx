import type { RefObject } from "react";

export const Videos = ({
  localRef,
  remoteRef,
}: {
  localRef: RefObject<HTMLVideoElement | null>
  remoteRef: RefObject<HTMLVideoElement | null>
}) => {
    console.log(localRef,remoteRef)
  return (
    <>
      <div>
        <video
          ref={localRef}
          autoPlay
          playsInline
          width="200"
          muted
          height="100"
          className="border border-black rounded-2xl"
        />{" "}
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          width="200"
          height="100"
          className="border border-black rounded-2xl"
        />
      </div>
    </>
  );
};
