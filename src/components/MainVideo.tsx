import { useEffect, type RefObject } from "react";

export const MainVideo = ({
  localRef,
}: {
  localRef: RefObject<HTMLVideoElement | null>;
}) => {
  useEffect(() => {
    if (
      !localRef.current ||
      !(localRef.current.srcObject instanceof MediaStream)
    ) {
      return;
    }

    const audioContext = new AudioContext();
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 512;

    const localSource = audioContext.createMediaStreamSource(
      localRef.current.srcObject
    );
    localSource.connect(analyzer);

    const dataArray = new Uint8Array(analyzer.frequencyBinCount);

    let rafId = 0;

    const analyze = () => {
      analyzer.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }

      const volume = sum / dataArray.length;
      const videoTag = document.getElementById("local-video");

      if (volume > 20) {
        videoTag?.style.setProperty("box-shadow", "0px 0px 4px 3px green");
        videoTag?.style.setProperty("border-color", "green");
      } else {
        videoTag?.style.setProperty(
          "box-shadow",
          "0px 0px 4px 3px transparent"
        );
        videoTag?.style.setProperty("border-color", "black");
      }

      rafId = requestAnimationFrame(analyze);
    };

    analyze();

    return () => {
      cancelAnimationFrame(rafId);
      localSource.disconnect();
      analyzer.disconnect();
      audioContext.close();
    };
  }, [localRef.current?.srcObject]);
  return (
    <video
      id="local-video"
      ref={localRef}
      autoPlay
      playsInline
      width="200"
      muted
      height="100"
      className="rounded-2xl border-4 transition-all duration-400"
      //   style={{"boxShadow":"0px 0px 3px 3px green"}}
    />
  );
};
