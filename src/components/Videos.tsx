import { useEffect, type RefObject } from "react";

export const Videos = ({
  localRef,
  remoteRef,
}: {
  localRef: RefObject<HTMLVideoElement | null>;
  remoteRef: RefObject<HTMLVideoElement | null>;
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

    const source = audioContext.createMediaStreamSource(
      localRef.current.srcObject
    );
    source.connect(analyzer);

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
        console.log("🎤 Hablando");
        videoTag?.style.setProperty("box-shadow", "0px 0px 4px 3px green");
        videoTag?.style.setProperty("border-color", "green");
      } else {
        console.log("🤫 Silencio");
        videoTag?.style.setProperty("box-shadow", "0px 0px 4px 3px transparent");
        videoTag?.style.setProperty("border-color", "black");
      }

      rafId = requestAnimationFrame(analyze);
    };

    analyze();

    return () => {
      cancelAnimationFrame(rafId);
      source.disconnect();
      analyzer.disconnect();
      audioContext.close();
    };
  }, [localRef.current?.srcObject]);

  return (
    <>
      <div>
        <video
          id="local-video"
          ref={localRef}
          autoPlay
          playsInline
          width="200"
          muted
          height="100"
          className="rounded-2xl border-4"
        //   style={{"boxShadow":"0px 0px 3px 3px green"}}
         
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
