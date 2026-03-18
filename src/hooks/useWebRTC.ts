import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { socket } from "../services/socket";
import { webrtcConfig } from "../services/webrtc";
import type { MediaState } from "../types/media";

type Params = {
  room: string;
  userId: string;
  videoRef: RefObject<HTMLVideoElement | null>;
  localMediaState: MediaState;
};

export const useWebRTC = ({
  room,
  userId,
  videoRef,
  localMediaState,
}: Params) => {
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const remoteStreams = useRef<Map<string, MediaStream>>(new Map());
  const [usersIds, setUsersIds] = useState<string[]>([]);
  const [remoteMediaStates, setRemoteMediaStates] = useState<
    Record<string, MediaState>
  >({});

  const localMediaStateRef = useRef<MediaState>(localMediaState);

  useEffect(() => {
    localMediaStateRef.current = localMediaState;
  }, [localMediaState]);

  useEffect(() => {
    if (!room || !userId) return;

    socket.emit("join-room", { room, userId });

    const userJoinedFn = async ({
      userId: joinedUserId,
      socketId,
    }: {
      userId: string;
      socketId: string;
    }) => {
      if (joinedUserId === userId) return;
      if (!(videoRef.current?.srcObject instanceof MediaStream)) return;

      const pc = new RTCPeerConnection(webrtcConfig);
      peerConnections.current.set(joinedUserId, pc);

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            room,
            candidate: e.candidate,
            from: userId,
            to: joinedUserId,
          });
        }
      };

      pc.ontrack = (event) => {
        remoteStreams.current.set(joinedUserId, event.streams[0]);
        setUsersIds((prev) =>
          prev.includes(joinedUserId) ? prev : [...prev, joinedUserId]
        );
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          socket.emit("media-update", {
            room,
            user: userId,
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
        from: userId,
        to: socketId,
      });
    };

    const offerFn = async ({
      offer,
      from,
    }: {
      offer: RTCSessionDescriptionInit;
      from: string;
    }) => {
      let pc = peerConnections.current.get(from);
      if (!pc) {
        pc = new RTCPeerConnection(webrtcConfig);
        peerConnections.current.set(from, pc);
      }

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice-candidate", {
            room,
            candidate: e.candidate,
            from: userId,
            to: from,
          });
        }
      };

      pc.ontrack = (event) => {
        remoteStreams.current.set(from, event.streams[0]);
        setUsersIds((prev) => (prev.includes(from) ? prev : [...prev, from]));
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          socket.emit("media-update", {
            room,
            user: userId,
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
        from: userId,
        to: from,
      });
    };

    const answerFn = async ({
      answer,
      from,
    }: {
      answer: RTCSessionDescriptionInit;
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
      candidate: RTCIceCandidateInit;
    }) => {
      const pc = peerConnections.current.get(from);
      if (pc && candidate) {
        pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    const removeUserFn = ({ user }: { user: string }) => {
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
      if (user === userId) return;
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
    socket.on("remove-user", removeUserFn);
    socket.on("media-update", mediaUpdateFn);

    return () => {
      socket.off("user-joined", userJoinedFn);
      socket.off("offer", offerFn);
      socket.off("answer", answerFn);
      socket.off("ice-candidate", iceCandidateFn);
      socket.off("remove-user", removeUserFn);
      socket.off("media-update", mediaUpdateFn);

      peerConnections.current.forEach((pc) => pc.close());
      peerConnections.current.clear();
      remoteStreams.current.clear();
      setUsersIds([]);
    };
  }, [room, userId, videoRef]);

  return { remoteStreams, remoteMediaStates, usersIds };
};
