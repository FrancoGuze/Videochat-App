import {
  createContext,
  type ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
type MediaState = {
  audio: boolean;
  video: boolean;
};
type AppContextType = {
  room: string;
  setRoom: (room: string) => void;
  id: string;
  setid: (id: string) => void;
  cameraActive: boolean;
  setCameraActive: (active: boolean) => void;
  audioActive: boolean;
  setAudioActive: (active: boolean) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  remoteMediaStates: Record<string, MediaState>;
  setRemoteMediaStates: (states: Record<string, MediaState>) => void;
  peerConnections: React.RefObject<Map<string, RTCPeerConnection>>;
  remoteStreams: React.RefObject<Map<string, MediaStream>>;
  usersIds: string[];
  setUsersIds: (ids: string[]) => void;
};

export const AppContext = createContext<AppContextType | null>(null);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [room, setRoom] = useState<string>("");
  const [id, setid] = useState<string>("");
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [audioActive, setAudioActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [remoteMediaStates, setRemoteMediaStates] = useState<
    Record<string, MediaState>
  >({});

  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const remoteStreams = useRef<Map<string, MediaStream>>(new Map());
  const [usersIds, setUsersIds] = useState<string[]>([]);

  return (
    <AppContext.Provider
      value={{
        room,
        setRoom,
        id,
        setid,
        cameraActive,
        setCameraActive,
        audioActive,
        setAudioActive,
        videoRef,
        remoteMediaStates,
        setRemoteMediaStates,
        peerConnections,
        remoteStreams,
        usersIds,
        setUsersIds,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
