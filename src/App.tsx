import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";
import { mediaObj, type MediaState } from "./utils";
import { Videos } from "./components/Videos";
import { SetupScreen } from "./components/SetupScreen";

export default function App() {
 const [room, setRoom] = useState<string>("");
  const [id, setid] = useState<string>("");

  const [localMediaState, setLocalMediaState] = useState<MediaState>({
    audio: true,
    video: true,
  });

  const [remoteMediaStates, setRemoteMediaStates] =
    useState<Record<string, MediaState>>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const remoteStreams = useRef<Map<string, MediaStream>>(new Map());
  const [usersIds, setUsersIds] = useState<string[]>([]);

  // ⭐ REF QUE CONTIENE EL ESTADO REAL SIEMPRE
  const localMediaStateRef = useRef<MediaState>({
    audio: true,
    video: true,
  });

  // ⭐ SINCRONIZAR EL REF CON EL STATE
  useEffect(() => {
    localMediaStateRef.current = localMediaState;
  }, [localMediaState]);

  useEffect(() => {
    if (room && id && socket) {
      socket.emit("join-room", { room, userId: id });
    }

    const userJoinedFn = async ({
      userId,
      socketId,
    }: {
      userId: string;
      socketId: string;
    }) => {
      if (userId === id) return;
      if (!(videoRef.current?.srcObject instanceof MediaStream)) return;

      const pc = new RTCPeerConnection(mediaObj.config);
      peerConnections.current.set(userId, pc);

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            room,
            candidate: e.candidate,
            from: id,
            to: userId,
          });
        }
      };

      pc.ontrack = (event) => {
        remoteStreams.current.set(userId, event.streams[0]);
        setUsersIds((prev) =>
          prev.includes(userId) ? prev : [...prev, userId]
        );
      };

      // ⭐ USAR EL REF (NO localMediaState)
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          socket.emit("media-update", {
            room,
            user: id,
            state: localMediaStateRef.current,
          });
        }
      };

      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("offer", {
        room,
        offer,
        from: id,
        to: socketId,
      });
    };

    const offerFn = async ({ offer, from }: { offer: any; from: string }) => {
      let pc = peerConnections.current.get(from);
      if (!pc) {
        pc = new RTCPeerConnection(mediaObj.config);
        peerConnections.current.set(from, pc);
      }

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            room,
            candidate: e.candidate,
            from: id,
            to: from,
          });
        }
      };

      pc.ontrack = (event) => {
        remoteStreams.current.set(from, event.streams[0]);
        setUsersIds((prev) => (prev.includes(from) ? prev : [...prev, from]));
      };

      // ⭐ USAR EL REF TAMBIÉN ACÁ
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          socket.emit("media-update", {
            room,
            user: id,
            state: localMediaStateRef.current,
          });
        }
      };

      const stream = videoRef.current?.srcObject;
      if (!(stream instanceof MediaStream)) return;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answer", {
        room,
        answer,
        from: id,
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
      const pc = peerConnections.current.get(from);
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const iceCandidateFn = ({
      from,
      candidate,
    }: {
      from: string;
      candidate: any;
    }) => {
      const pc = peerConnections.current.get(from);
      if (pc && candidate) {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    const removeuserFn = ({ user }: { user: string }) => {
      peerConnections.current.delete(user);
      remoteStreams.current.delete(user);
      setUsersIds((prev) => prev.filter((id) => id !== user));
    };

    const mediaUpdateFn = ({
      user,
      state,
    }: {
      user: string;
      state: MediaState;
    }) => {
      if (user === id) return;
      setRemoteMediaStates((prev) => ({
        ...prev,
        [user]: {
          audio: state.audio ?? prev[user]?.audio,
          video: state.video ?? prev[user]?.video,
        },
      }));
    };

    socket.on("user-joined", userJoinedFn);
    socket.on("offer", offerFn);
    socket.on("answer", answerFn);
    socket.on("ice-candidate", iceCandidateFn);
    socket.on("remove-user", removeuserFn);
    socket.on("media-update", mediaUpdateFn);

    return () => {
      socket.off("user-joined", userJoinedFn);
      socket.off("offer", offerFn);
      socket.off("answer", answerFn);
      socket.off("ice-candidate", iceCandidateFn);
      socket.off("remove-user", removeuserFn);
      socket.off("media-update", mediaUpdateFn);

      peerConnections.current.forEach((pc) => pc.close());
      peerConnections.current.clear();
      remoteStreams.current.clear();
      setUsersIds([]);
    };
  }, [room]);
  // useEffect local para setear los MediaStreamtracks
  useEffect(() => {
    const setVideoRef = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        console.log(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          if (
            videoRef.current &&
            videoRef.current.srcObject instanceof MediaStream
          ) {
            const audioTrack = videoRef.current.srcObject.getAudioTracks()[0];
            audioTrack.enabled = true;

            const videoTrack = videoRef.current.srcObject.getVideoTracks()[0];
            videoTrack.enabled = true;
            setLocalMediaState({
              audio: audioTrack.enabled,
              video: videoTrack.enabled,
            });
          }
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
  useEffect(() => {
    console.log("App.tsx: ", { localMediaState });
  }, [localMediaState]);
  return (
    <>
      <div className="relative bg-shadow-grey-900 h-screen w-screen flex items-center justify-center overflow-x-hidden">
        <SetupScreen setId={setid} setRoom={setRoom} />
        <div className="absolute top-0 bg-shadow-grey-800 border-8 border-transparent px-4 border-t-0 rounded-bl-3xl rounded-br-3xl flex flex-row items-center">
          <p className="text-porcelain-50">Sala: {room}</p>
        </div>

        <Videos
          localRef={videoRef}
          localMediaState={localMediaState}
          remoteMediaStates={remoteMediaStates}
          remoteStreams={remoteStreams}
          userids={usersIds}
        />

        {/* <div className="bg-green-300">
          <button
            onClick={() => {
              console.log(room);
              socket.emit("join-room", { room: room, userId: id });
            }}
            className="bg-red-400 w-40 h-12"
          >
            Join room
          </button>
        </div> */}

        <div className="absolute bottom-0 bg-shadow-grey-800 pb-1.5 border-8 border-transparent px-4 border-b-0 rounded-tl-3xl rounded-tr-3xl flex flex-row items-center gap-3">
          <button
            className={`${
              localMediaState.audio
                ? " bg-shadow-grey-700 hover:bg-gray-600"
                : "bg-red-500/40 hover:bg-flag-red-500/70"
            } transition-colors duration-75 p-1 rounded-lg group`}
            onClick={() =>
              mediaObj.pauseAudio(
                videoRef,
                localMediaState,
                setLocalMediaState,
                room,
                id
              )
            }
          >
            <svg
              className={`w-8 h-8  p-1 rounded-lg ${
                localMediaState.video
                  ? "fill-shadow-grey-300 group-hover:fill-shadow-grey-100"
                  : "fill-shadow-grey-900 group-hover:fill-shadow-grey-800"
              } transition-colors duration-75`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              {!localMediaState.audio ? (
                <path d="M80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416zM399 239C389.6 248.4 389.6 263.6 399 272.9L446 319.9L399 366.9C389.6 376.3 389.6 391.5 399 400.8C408.4 410.1 423.6 410.2 432.9 400.8L479.9 353.8L526.9 400.8C536.3 410.2 551.5 410.2 560.8 400.8C570.1 391.4 570.2 376.2 560.8 366.9L513.8 319.9L560.8 272.9C570.2 263.5 570.2 248.3 560.8 239C551.4 229.7 536.2 229.6 526.9 239L479.9 286L432.9 239C423.5 229.6 408.3 229.6 399 239z" />
              ) : (
                <path d="M533.6 96.5C523.3 88.1 508.2 89.7 499.8 100C491.4 110.3 493 125.4 503.3 133.8C557.5 177.8 592 244.8 592 320C592 395.2 557.5 462.2 503.3 506.3C493 514.7 491.5 529.8 499.8 540.1C508.1 550.4 523.3 551.9 533.6 543.6C598.5 490.7 640 410.2 640 320C640 229.8 598.5 149.2 533.6 96.5zM473.1 171C462.8 162.6 447.7 164.2 439.3 174.5C430.9 184.8 432.5 199.9 442.8 208.3C475.3 234.7 496 274.9 496 320C496 365.1 475.3 405.3 442.8 431.8C432.5 440.2 431 455.3 439.3 465.6C447.6 475.9 462.8 477.4 473.1 469.1C516.3 433.9 544 380.2 544 320.1C544 260 516.3 206.3 473.1 171.1zM412.6 245.5C402.3 237.1 387.2 238.7 378.8 249C370.4 259.3 372 274.4 382.3 282.8C393.1 291.6 400 305 400 320C400 335 393.1 348.4 382.3 357.3C372 365.7 370.5 380.8 378.8 391.1C387.1 401.4 402.3 402.9 412.6 394.6C434.1 376.9 448 350.1 448 320C448 289.9 434.1 263.1 412.6 245.5zM80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416z" />
              )}
            </svg>
          </button>
          <button
            className={`${
              localMediaState.video
                ? " bg-shadow-grey-700 hover:bg-gray-600"
                : "bg-red-500/40 hover:bg-flag-red-500/70"
            } transition-colors duration-75 p-1 rounded-lg group`}
            onClick={() =>
              mediaObj.pauseVideo(
                videoRef,
                localMediaState,
                setLocalMediaState,
                room,
                id
              )
            }
          >
            <svg
              className={`w-8 h-8  p-1 rounded-lg ${
                localMediaState.video
                  ? "fill-shadow-grey-300 group-hover:fill-shadow-grey-100"
                  : "fill-shadow-grey-900 group-hover:fill-shadow-grey-800"
              } transition-colors duration-75`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              {!localMediaState.video ? (
                <path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L447.9 414.2L447.9 192C447.9 156.7 419.2 128 383.9 128L161.8 128L73 39.1zM64 192L64 448C64 483.3 92.7 512 128 512L384 512C391.8 512 399.3 510.6 406.2 508L68 169.8C65.4 176.7 64 184.2 64 192zM496 400L569.5 458.8C573.7 462.2 578.9 464 584.3 464C597.4 464 608 453.4 608 440.3L608 199.7C608 186.6 597.4 176 584.3 176C578.9 176 573.7 177.8 569.5 181.2L496 240L496 400z" />
              ) : (
                <path d="M128 128C92.7 128 64 156.7 64 192L64 448C64 483.3 92.7 512 128 512L384 512C419.3 512 448 483.3 448 448L448 192C448 156.7 419.3 128 384 128L128 128zM496 400L569.5 458.8C573.7 462.2 578.9 464 584.3 464C597.4 464 608 453.4 608 440.3L608 199.7C608 186.6 597.4 176 584.3 176C578.9 176 573.7 177.8 569.5 181.2L496 240L496 400z" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

//  <button
//               onClick={() =>
//                 mediaObj.pauseAudio(
//                   videoRef,
//                   localMediaState,
//                   setLocalMediaState,
//                   room,
//                   id
//                 )
//               }
//               className="bg-green-500 px-1"
//             >
//               {localMediaState.audio ? "Pausar" : "Iniciar"} audio
//             </button>
//             <button
//               onClick={() =>
//                 mediaObj.pauseVideo(
//                   videoRef,
//                   localMediaState,
//                   setLocalMediaState,
//                   room,
//                   id
//                 )
//               }
//               className="bg-green-500 px-1"
//             >
//               {localMediaState.video ? "Pausar" : "Iniciar"} camara
//             </button>
