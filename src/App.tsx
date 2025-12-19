import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { socket } from "./socket";
import { mediaObj } from "./utils";
import { Videos } from "./components/Videos";
import { SetupScreen } from "./components/SetupScreen";
export default function App() {
  const [room, setRoom] = useState<string>("");
  const [id, setid] = useState<string>("");
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [audioActive, setAudioActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  // const createPeerConnection = () => {
  //   const pc = new RTCPeerConnection(config);

  //   pc.onicecandidate = (e) => {
  //     if (e.candidate) {
  //       socket.emit("ice-candidate", {
  //         room,
  //         candidate: e.candidate,
  //       });
  //     }
  //   };

  //   pc.ontrack = (event) => {
  //     if (remoteVideoRef.current) {
  //       remoteVideoRef.current.srcObject = event.streams[0];
  //     }
  //   };

  //   pc.onsignalingstatechange = () =>
  //     console.log("signaling:", pc.signalingState);

  //   pc.oniceconnectionstatechange = () =>
  //     console.log("ice:", pc.iceConnectionState);

  //   pc.onconnectionstatechange = () => console.log("conn:", pc.connectionState);

  //   return pc;
  // };
  const config = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  useEffect(() => {
    const userJoinedFn = async ({ userId }: { userId: string }) => {
      console.log("User joined", userId);
      if (userId === id) return;

      if (
        videoRef.current &&
        videoRef.current.srcObject instanceof MediaStream
      ) {
        // 👉 crear PC
        pcRef.current = new RTCPeerConnection(config);
        const pc = pcRef.current;

        // ✅ ICE DESDE EL INICIO
        pc.onicecandidate = (e) => {
          if (e.candidate) {
            socket.emit("ice-candidate", {
              room,
              candidate: e.candidate,
            });
          }
        };

        // ✅ recibir tracks remotos
        pc.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        // 👉 agregar tracks locales
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        // 👉 offer
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("offer", { room, offer });
      }
    };

    const offerFn = async ({ offer, from }: { offer: any; from: any }) => {
      console.log("offer recieved")
      if (!pcRef.current) {
        pcRef.current = new RTCPeerConnection(config);
      }

      const pc = pcRef.current;

      // ✅ ICE DESDE EL INICIO
      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            room,
            candidate: e.candidate,
          });
        }
      };

      // ✅ recibir tracks remotos
      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      console.log("Offer received from:", from);

      // 👉 tracks locales
      const stream = videoRef.current?.srcObject;
      if (!stream || !(stream instanceof MediaStream)) return;

      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });

      // 👉 SDP
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", {
        room,
        answer,
        to: from,
      });
    };

    const answerFn = async ({
      answer,
      from,
    }: {
      answer: any;
      from: string;
    }) => {
      console.log("Answer received from:", from);

      if (!pcRef.current) return;

      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    };

    const iceCandidateFn = ({ candidate }: { candidate: any }) => {
      console.log("Ice cadidate function start")
      if (pcRef.current && candidate) {
        pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    socket.on("user-joined", userJoinedFn);
    socket.on("offer", offerFn);
    socket.on("answer", answerFn);
    socket.on("ice-candidate", iceCandidateFn);

    return () => {
      socket.off("user-joined", userJoinedFn);
      socket.off("offer", offerFn);
      socket.off("answer", answerFn);
      socket.off("ice-candidate", iceCandidateFn);

      pcRef.current?.close();
      pcRef.current = null;
    };
  }, []);

  useEffect(() => {
    const setVideoRef = async () => {
      // console.log("SetVideoRef functions Start");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        // console.log(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setAudioActive(false);
          setCameraActive(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    setVideoRef();

    return () => {
      if (
        videoRef.current &&
        videoRef.current.srcObject instanceof MediaStream
      ) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((element) => {
          element.stop();
        });
      }
    };
  }, []);
  return (
    <>
      <div className="relative bg-gray-600 h-screen w-screen flex items-center justify-center overflow-x-hidden">
      <SetupScreen setId={setid} setRoom={setRoom} /> 

        {/* <button className="bg-green-500 px-1">iniciar conexion</button> */}
        <button
          onClick={() => mediaObj.pauseAudio(videoRef, setAudioActive)}
          className="bg-green-500 px-1"
        >
          {audioActive ? "Pausar" : "Iniciar"} audio
        </button>
        <button
          onClick={() => mediaObj.pauseVideo(videoRef, setCameraActive)}
          className="bg-green-500 px-1"
        >
          {cameraActive ? "Pausar" : "Iniciar"} camara
        </button>
        {/* <Videos localRef={videoRef} remoteRef={remoteVideoRef} /> */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          width="200"
          muted
          height="100"
          className="border border-black rounded-2xl"
        />{" "}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          width="200"
          height="100"
          className="border border-black rounded-2xl"
        />
        <div className="bg-green-300">
          <button
            onClick={() => {
              socket.emit("join-room", { room: room, userId: id });
            }}
            className="bg-red-400 w-40 h-12"
          >
            Join room
          </button>
        </div>
      </div>
    </>
  );
}
