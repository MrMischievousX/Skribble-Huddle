import { getHuddleClient } from "@huddle01/huddle01-client";

import { useHuddleStore } from "@huddle01/huddle01-client/store";
import PeerVideoAudioElem from "./OtherVideo";
import MeVideoElem from "./SelfVideo";
import { useState, useEffect } from "react";

function LayoutHeader({ children }: { children: any }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg px-10 py-8 mx-auto bg-white rounded-lg shadow-xl">
        <div className="max-w-md mx-auto space-y-6">
          {/* Component starts here */}
          <h2 className="flex flex-row flex-nowrap items-center my-8">
            <span
              className="flex-grow block border-t border-black"
              aria-hidden="true"
              role="presentation"
            />
            <span className="flex-none block mx-4   px-4 py-2.5 text-xs leading-none font-medium uppercase bg-black text-white">
              Huddle Meet
            </span>
            <span
              className="flex-grow block border-t border-black"
              aria-hidden="true"
              role="presentation"
            />
          </h2>
          {/* Component ends here */}
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Meet() {
  const huddleClient = getHuddleClient(process.env.NEXT_PUBLIC_HUDDLE_API_KEY);
  const peersKeys = useHuddleStore((state) => Object.keys(state.peers));
  const lobbyPeers = useHuddleStore((state) => state.lobbyPeers);
  const roomState = useHuddleStore((state) => state.roomState);
  const recordingState = useHuddleStore((state) => state.recordingState);
  const recordings = useHuddleStore((state) => state.recordings);

  const [domLoaded, setDomLoaded] = useState(false);
  const [roomId, setRoomId] = useState("dev");

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const handleJoin = async () => {
    try {
      await huddleClient.join(roomId, {
        address: "0x15900c698ee356E6976e5645394F027F0704c8Eb",
        wallet: "",
        ens: "axit.eth",
      });

      console.log("joined");
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <>
      <LayoutHeader>
        <div className="flex">
          <div className="md:flex-2 sm:flex-1"> </div>
          <div className="md:flex-2 sm:flex-3">
            <div>
              <div className="mt-6 flex-1  flow-root">
                <h2 className={`text-${!roomState.joined ? "red" : "green"}`}>
                  Room Joined:&nbsp;{roomState.joined.toString()}
                </h2>

                <button onClick={handleJoin}>Join Room</button>

                <input
                  type="text"
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter Room ID"
                ></input>
                <button onClick={() => huddleClient.enableWebcam()}>
                  Enable Webcam
                </button>
                <button onClick={() => huddleClient.disableWebcam()}>
                  Disable Webcam
                </button>
                <button
                  onClick={() => huddleClient.allowAllLobbyPeersToJoinRoom()}
                >
                  allowAllLobbyPeersToJoinRoom()
                </button>
                <button
                  onClick={() =>
                    // will not work in localhost
                    huddleClient.startRecording({
                      sourceUrl: window.location.href,
                    })
                  }
                >
                  startRecording()
                </button>
                <button
                  onClick={() => huddleClient.stopRecording({ ipfs: true })}
                >
                  stopRecording()
                </button>

                {domLoaded && <MeVideoElem />}

                {lobbyPeers[0] && <h2>Lobby Peers</h2>}
                <div>
                  {lobbyPeers.map((peer) => (
                    <div>{peer.peerId}</div>
                  ))}
                </div>

                {peersKeys[0] && <h2>Peers</h2>}

                <div className="peers-grid">
                  {peersKeys.map((key) => (
                    <PeerVideoAudioElem
                      key={`peerId-${key}`}
                      peerIdAtIndex={key}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="md:flex-2 sm:flex-1"> </div>
        </div>
      </LayoutHeader>
    </>
  );
}
