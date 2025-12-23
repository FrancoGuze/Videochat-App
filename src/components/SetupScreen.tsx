import {
  useEffect,
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
  const [thisid, setThisId] = useState<string>(
    `User${Math.round(Math.random() * 900)}`
  );
  const [thisRoom, setThisRoom] = useState<string>("123");

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
      className={`absolute inset-0 w-screen h-screen bg-cyan-600 ${
        show ? "left-0" : "left-full"
      } transition-all duration-600`}
    >
      <h1>Hi! Welcome to my video chat app!</h1>
      <label htmlFor="user-id">Please, insert a good name for you!</label>

      <input
        type="text"
        name="user-id"
        id="user-id"
        required
        value={thisid}
        onChange={(e) => setThisId(e.target.value)}
      />
      <label htmlFor="room-id">And you also have to add a room id!</label>
      <input
        id="room-id"
        name="room-id"
        className="bg-green-700"
        type="text"
        required
        value={thisRoom}
        onChange={(e) => setThisRoom(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
