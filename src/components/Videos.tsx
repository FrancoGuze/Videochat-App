import { type RefObject } from "react";
import { MainVideo } from "./MainVideo";
import { RemoteVideo } from "./RemoteVideo";
import type { MediaState } from "../types/media";

export const Videos = ({
  localRef,
  localMediaState,
  remoteMediaStates,
  remoteStreams,
  userids,
}: {
  localRef: RefObject<HTMLVideoElement | null>;
  localMediaState: MediaState;
  remoteMediaStates: { [user: string]: MediaState };
  remoteStreams: RefObject<Map<string, MediaStream>>;
  userids: string[];
}) => {
  const hasRemoteUsers = userids.length > 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-10 pb-28">
      {hasRemoteUsers ? (
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="w-full sm:w-[48%] xl:w-[32%]">
            <MainVideo localRef={localRef} localMediaState={localMediaState} />
          </div>
          {userids.map((user) => {
            const userStream = remoteStreams.current.get(user);
            if (!userStream) return null;
            return (
              <div key={user} className="w-full sm:w-[48%] xl:w-[32%]">
                <RemoteVideo
                  user={user}
                  stream={userStream}
                  remoteMediaStates={
                    remoteMediaStates[user] ?? { audio: true, video: false }
                  }
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <MainVideo localRef={localRef} localMediaState={localMediaState} />
          </div>
        </div>
      )}
      {!hasRemoteUsers && (
        <p className="mt-6 text-sm text-shadow-grey-300 text-center">
          Waiting for others. Share the room name to invite someone.
        </p>
      )}
    </div>
  );
};
