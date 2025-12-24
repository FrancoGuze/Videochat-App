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
  // `User${Math.round(Math.random() * 900)}`
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
      className={`absolute group inset-0 w-screen h-screen bg-shadow-grey-600 flex flex-col items-center justify-center gap-10 z-40 ${
        show ? "left-0" : "left-full"
      } transition-all duration-600`}
    >
      <h1 className="text-3xl font-semibold">Video Chat App</h1>
      <div className="bg-white min-w-1/2 px-4 py-3 rounded-xl">
        <p className="text-gray-600">
          Please, fill the following fields to use the app
        </p>

        <div className="relative my-4 px-1">
          <input
            className="peer px-1.5  h-10 w-full border-2 rounded-lg text-baltic-blue-900 border-baltic-blue-700 placeholder-shown:border-gray-300 focus:text-baltic-blue-700 focus:border-baltic-blue-500 outline-0"
            type="text"
            name="user-id"
            id="user-id"
            required
            placeholder=""
            value={thisid}
            onChange={(e) => setThisId(e.target.value)}
          />
          <label
            className="absolute bg-white text-baltic-blue-700 rounded-lg px-1 peer-focus:text-baltic-blue-500 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base text-sm -top-3 left-3.5 transition-all duration-75"
            htmlFor="user-id"
          >
            Username
          </label>
        </div>

        <div className="relative my-4 px-1">
          <input
            id="room-id"
            name="room-id"
            className="peer px-1.5  h-10 w-full border-2 rounded-lg text-baltic-blue-900 border-baltic-blue-700 placeholder-shown:border-gray-300 focus:text-baltic-blue-700 focus:border-baltic-blue-500 outline-0"
            placeholder=""
            type="text"
            required
            value={thisRoom}
            onChange={(e) => setThisRoom(e.target.value)}
          />{" "}
          <label
            htmlFor="room-id"
            className="absolute bg-white text-baltic-blue-700 rounded-lg px-1 peer-focus:text-baltic-blue-500 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base text-sm -top-3 left-3.5 transition-all duration-75"
          >
            Room
          </label>
        </div>
        <button
          type="submit"
          className="bg-gray-400 px-2.5 py-0.5 rounded-lg group-valid:bg-baltic-blue-300 group-valid:text-baltic-blue-800 group-valid:hover:bg-baltic-blue-200 group-invalid:bg-gray-200 group-invalid:text-gray-300 group-invalid:cursor-auto group-valid:cursor-pointer"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
