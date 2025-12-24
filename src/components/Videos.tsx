import { type RefObject } from "react";
import { MainVideo } from "./MainVideo";
import { RemoteVideo } from "./RemoteVideo";
import type { MediaState } from "../utils";

export const Videos = ({
  localRef,
  localMediaState,
  remoteMediaStates,
  remoteStreams,
  userids,
}: {
  localRef: RefObject<HTMLVideoElement | null>;
  localMediaState: { [key: string]: boolean };
  remoteMediaStates: { [user: string]: MediaState };
  remoteStreams: RefObject<Map<string, MediaStream>>;
  userids: string[];
}) => {
  return (
    <>
      <div className="flex flex-row">
        <MainVideo localRef={localRef} localMediaState={localMediaState} />
        {userids.map((user) => {
          const userStream = remoteStreams.current.get(user);
          if (!userStream) return;
          // console.log(user,remoteMediaStates[user]);
          return (
            <RemoteVideo
              key={user}
              user={user}
              stream={userStream}
              remoteMediaStates={
                remoteMediaStates[user] ?? { audio: true, video: false }
              }
            />
          );
        })}
      </div>
    </>
  );
};
