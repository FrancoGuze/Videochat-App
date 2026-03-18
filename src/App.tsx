import { useEffect, useState } from "react";
import { useLocalMedia } from "./hooks/useLocalMedia";
import { useMediaControls } from "./hooks/useMediaControls";
import { useWebRTC } from "./hooks/useWebRTC";
import { Videos } from "./components/Videos";
import { SetupScreen } from "./components/SetupScreen";

export default function App() {
  const [room, setRoom] = useState<string>("");
  const [id, setId] = useState<string>("");

  const { videoRef, localMediaState, setLocalMediaState } = useLocalMedia();
  const { remoteMediaStates, remoteStreams, usersIds } = useWebRTC({
    room,
    userId: id,
    videoRef,
    localMediaState,
  });
  const { toggleAudio, toggleVideo } = useMediaControls({
    videoRef,
    localMediaState,
    setLocalMediaState,
    room,
    userId: id,
  });

  useEffect(() => {
    console.log("App.tsx: ", { localMediaState });
  }, [localMediaState]);

  const connectionStatus =
    room && id ? (usersIds.length > 0 ? "Connected" : "Connecting") : "Idle";

  return (
    <div className="relative min-h-screen bg-shadow-grey-950 text-porcelain-50 overflow-hidden">
      <SetupScreen setId={setId} setRoom={setRoom} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(52,130,203,0.12),transparent_50%),radial-gradient(circle_at_85%_10%,rgba(252,219,3,0.1),transparent_40%),radial-gradient(circle_at_80%_85%,rgba(210,45,50,0.1),transparent_45%)]" />

      <header className="relative z-10 px-6 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-baltic-blue-400/20 border border-baltic-blue-300/40 flex items-center justify-center text-baltic-blue-100">
              VC
            </div>
            <div>
              <p className="text-lg font-semibold">Video chat practice</p>
              <p className="text-xs text-shadow-grey-300">
                WebRTC + MediaStreams
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-shadow-grey-200">
            <div
              className={`px-3 py-1 rounded-full border text-xs ${
                connectionStatus === "Connected"
                  ? "border-porcelain-400/50 bg-porcelain-400/10 text-porcelain-50"
                  : connectionStatus === "Connecting"
                  ? "border-bright-gold-400/40 bg-bright-gold-400/10 text-bright-gold-100"
                  : "border-shadow-grey-700 bg-shadow-grey-900/60 text-shadow-grey-300"
              }`}
            >
              {connectionStatus}
            </div>
            <div className="px-3 py-1 rounded-full border border-shadow-grey-700 bg-shadow-grey-900/60">
              Room: {room || "-"}
            </div>
            <div className="px-3 py-1 rounded-full border border-shadow-grey-700 bg-shadow-grey-900/60">
              You: {id || "-"}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <Videos
          localRef={videoRef}
          localMediaState={localMediaState}
          remoteMediaStates={remoteMediaStates}
          remoteStreams={remoteStreams}
          userids={usersIds}
        />
      </main>

      <div className="fixed bottom-6 left-0 right-0 z-10 flex items-center justify-center px-6">
        <div className="flex items-center gap-3 rounded-2xl border border-shadow-grey-700 bg-shadow-grey-900/80 px-4 py-3 backdrop-blur">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-150 ${
              localMediaState.audio
                ? "bg-shadow-grey-800 hover:bg-shadow-grey-700 text-porcelain-50"
                : "bg-flag-red-500/70 hover:bg-flag-red-500 text-shadow-grey-950"
            }`}
            onClick={toggleAudio}
          >
            <svg
              className={`w-5 h-5 ${
                localMediaState.audio
                  ? "fill-porcelain-50"
                  : "fill-shadow-grey-900"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              {!localMediaState.audio ? (
                <path d="M80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416zM399 239C389.6 248.4 389.6 263.6 399 272.9L446 319.9L399 366.9C389.6 376.3 389.6 391.5 399 400.8C408.4 410.1 423.6 410.2 432.9 400.8L479.9 353.8L526.9 400.8C536.3 410.2 551.5 410.2 560.8 400.8C570.1 391.4 570.2 376.2 560.8 366.9L513.8 319.9L560.8 272.9C570.2 263.5 570.2 248.3 560.8 239C551.4 229.7 536.2 229.6 526.9 239L479.9 286L432.9 239C423.5 229.6 408.3 229.6 399 239z" />
              ) : (
                <path d="M533.6 96.5C523.3 88.1 508.2 89.7 499.8 100C491.4 110.3 493 125.4 503.3 133.8C557.5 177.8 592 244.8 592 320C592 395.2 557.5 462.2 503.3 506.3C493 514.7 491.5 529.8 499.8 540.1C508.1 550.4 523.3 551.9 533.6 543.6C598.5 490.7 640 410.2 640 320C640 229.8 598.5 149.2 533.6 96.5zM473.1 171C462.8 162.6 447.7 164.2 439.3 174.5C430.9 184.8 432.5 199.9 442.8 208.3C475.3 234.7 496 274.9 496 320C496 365.1 475.3 405.3 442.8 431.8C432.5 440.2 431 455.3 439.3 465.6C447.6 475.9 462.8 477.4 473.1 469.1C516.3 433.9 544 380.2 544 320.1C544 260 516.3 206.3 473.1 171.1zM412.6 245.5C402.3 237.1 387.2 238.7 378.8 249C370.4 259.3 372 274.4 382.3 282.8C393.1 291.6 400 305 400 320C400 335 393.1 348.4 382.3 357.3C372 365.7 370.5 380.8 378.8 391.1C387.1 401.4 402.3 402.9 412.6 394.6C434.1 376.9 448 350.1 448 320C448 289.9 434.1 263.1 412.6 245.5zM80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416z" />
              )}
            </svg>
            {localMediaState.audio ? "Mute" : "Unmute"}
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-150 ${
              localMediaState.video
                ? "bg-shadow-grey-800 hover:bg-shadow-grey-700 text-porcelain-50"
                : "bg-flag-red-500/70 hover:bg-flag-red-500 text-shadow-grey-950"
            }`}
            onClick={toggleVideo}
          >
            <svg
              className={`w-5 h-5 ${
                localMediaState.video
                  ? "fill-porcelain-50"
                  : "fill-shadow-grey-900"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
            >
              {!localMediaState.video ? (
                <path d="M73 39.1C63.6 29.7 48.4 29.7 39.1 39.1C29.8 48.5 29.7 63.7 39 73.1L567 601.1C576.4 610.5 591.6 610.5 600.9 601.1C610.2 591.7 610.3 576.5 600.9 567.2L447.9 414.2L447.9 192C447.9 156.7 419.2 128 383.9 128L161.8 128L73 39.1zM64 192L64 448C64 483.3 92.7 512 128 512L384 512C391.8 512 399.3 510.6 406.2 508L68 169.8C65.4 176.7 64 184.2 64 192zM496 400L569.5 458.8C573.7 462.2 578.9 464 584.3 464C597.4 464 608 453.4 608 440.3L608 199.7C608 186.6 597.4 176 584.3 176C578.9 176 573.7 177.8 569.5 181.2L496 240L496 400z" />
              ) : (
                <path d="M128 128C92.7 128 64 156.7 64 192L64 448C64 483.3 92.7 512 128 512L384 512C419.3 512 448 483.3 448 448L448 192C448 156.7 419.3 128 384 128L128 128zM496 400L569.5 458.8C573.7 462.2 578.9 464 584.3 464C597.4 464 608 453.4 608 440.3L608 199.7C608 186.6 597.4 176 584.3 176C578.9 176 573.7 177.8 569.5 181.2L496 240L496 400z" />
              )}
            </svg>
            {localMediaState.video ? "Stop video" : "Start video"}
          </button>
        </div>
      </div>
    </div>
  );
}
