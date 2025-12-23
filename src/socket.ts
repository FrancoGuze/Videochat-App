import { io } from "socket.io-client";
const url = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";
console.log(url);
export const socket = io(url, {
  transports: ["websocket"],
});



/*
FUNCIONALIDAD ED DETECCION DE SONIDO



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

*/