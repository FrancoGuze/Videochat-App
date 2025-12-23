import { useEffect, type RefObject } from "react";
import { MainVideo } from "./MainVideo";
import { RemoteVideo } from "./RemoteVideo";
import type { MediaState } from "../utils";

export const Videos = ({
  localRef,
  localMediaState,
  remoteMediaStates,
  remoteStreams,
  userids,
  room,
}: {
  localRef: RefObject<HTMLVideoElement | null>;
  localMediaState: { [key: string]: boolean };
  remoteMediaStates: { [user: string]: MediaState };
  remoteStreams: RefObject<Map<string, MediaStream>>;
  userids: string[];
  room: string;
}) => {

  return (
    <>
      <div className="flex flex-row">
        <MainVideo localRef={localRef} localMediaState={localMediaState} />
        {userids.map((user) => {
          const userStream = remoteStreams.current.get(user);
          console.log(userids,userStream)
          if (!userStream) return;
          console.log(remoteMediaStates[user]);
          return (
            <RemoteVideo
              key={user}
              user={user}
              stream={userStream}
              remoteMediaStates={
                remoteMediaStates[user] ?? { audio: true, video: false }
              }
              room={room}
            />
          );
        })}
      </div>
    </>
  );
};
