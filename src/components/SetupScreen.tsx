import {
  useState,
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";

export const SetupScreen = ({
  setId,
  setRoom,
}: {
  setId: Dispatch<SetStateAction<string>>;
  setRoom: Dispatch<SetStateAction<string>>;
}) => {
  const [thisid, setThisId] = useState<string>("");
  const [thisRoom, setThisRoom] = useState<string>("");
  const [show, setShow] = useState<boolean>(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (thisid === "") {
      alert("You can't have an empty name...");
      return;
    }
    if (thisRoom === "") {
      alert("The room name can't be empty");
      return;
    }
    const backUrl = import.meta.env.VITE_BACKEND_URL;
    const fetchUrl = `${backUrl}userExists/${thisid}`;

    const fetchRes = await fetch(fetchUrl, {
      headers: { "Content-Type": "Application/json" },
    });
    if (!fetchRes.ok) {
      console.error("error en el fetch");
      return;
    }
    const { exists } = await fetchRes.json();
    if (exists) {
      alert(
        "There already is an user with that name. Please, try another name"
      );
    } else {
      setId(thisid);
      setRoom(thisRoom);
      setShow(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`absolute inset-0 z-40 w-screen h-screen transition-transform duration-700 ${
        show ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="absolute inset-0 bg-shadow-grey-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(52,130,203,0.2),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(252,219,3,0.12),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(210,45,50,0.12),transparent_50%)]" />
      <div className="relative h-full w-full px-6 py-10 flex items-center justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-porcelain-50 space-y-5">
            <h1 className="text-3xl lg:text-4xl font-semibold leading-tight">
              Simple WebRTC practice room
            </h1>
            <p className="text-shadow-grey-200 text-base lg:text-lg max-w-md">
              This page is here to practice WebRTC and MediaStreams. Pick a
              username and a room, then you can join and test audio/video.
            </p>
            <div className="text-sm text-shadow-grey-300 space-y-2">
              <p>It checks if your username is already taken.</p>
              <p>It connects you to the room and starts the call.</p>
            </div>
          </div>

          <div className="bg-shadow-grey-900/70 border border-shadow-grey-700/60 rounded-2xl p-6 lg:p-7 backdrop-blur">
            <h2 className="text-xl font-semibold text-porcelain-50">
              Join a room
            </h2>
            <p className="mt-2 text-sm text-shadow-grey-200">
              Use any name. Room can be anything you share with a friend.
            </p>

            <div className="mt-5 space-y-4">
              <div className="relative">
                <input
                  className="peer w-full h-11 rounded-xl border border-shadow-grey-700 bg-shadow-grey-950/60 px-4 text-porcelain-50 placeholder-transparent focus:border-baltic-blue-400 focus:ring-2 focus:ring-baltic-blue-400/30 outline-none"
                  type="text"
                  name="user-id"
                  id="user-id"
                  required
                  placeholder="Username"
                  value={thisid}
                  onChange={(e) => setThisId(e.target.value)}
                />
                <label
                  className="absolute left-3 -top-2 text-xs text-shadow-grey-300 transition-all peer-focus:text-baltic-blue-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-shadow-grey-300 bg-shadow-grey-950/90 px-2 rounded"
                  htmlFor="user-id"
                >
                  Username
                </label>
              </div>

              <div className="relative">
                <input
                  id="room-id"
                  name="room-id"
                  className="peer w-full h-11 rounded-xl border border-shadow-grey-700 bg-shadow-grey-950/60 px-4 text-porcelain-50 placeholder-transparent focus:border-baltic-blue-400 focus:ring-2 focus:ring-baltic-blue-400/30 outline-none"
                  placeholder="Room"
                  type="text"
                  required
                  value={thisRoom}
                  onChange={(e) => setThisRoom(e.target.value)}
                />
                <label
                  htmlFor="room-id"
                  className="absolute left-3 -top-2 text-xs text-shadow-grey-300 transition-all peer-focus:text-baltic-blue-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-shadow-grey-300 bg-shadow-grey-950/90 px-2 rounded"
                >
                  Room
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="mt-5 w-full h-11 rounded-xl bg-baltic-blue-400 text-baltic-blue-950 font-semibold transition-all duration-150 hover:bg-baltic-blue-300 focus:outline-none focus:ring-2 focus:ring-baltic-blue-200"
            >
              Join
            </button>
            <p className="mt-3 text-xs text-shadow-grey-300">
              You can close the page anytime. This is just a demo.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};
