import {
  getHuddleClient,
  HuddleClientProvider,
} from "@huddle01/huddle01-client";
import { useEffect, useRef, useState } from "react";
import { createContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Error from "./Screens/Error";
import Homepage from "./Screens/Homepage";
import Lobby from "./Screens/Lobby";
import Main from "./Screens/Main";
import { joinRoom } from "./utils/SocketHelpers";

export const Context = createContext<{
  wsRef: any; //Websocket ref
  clientRef: any; //Client Id ref
  gameRef: any; //Game Id ref
  socketState: any; //Manage drawing states
  name: any; //Current user name
  setCreator: Function; //Current game creator update function
  creator: boolean; //Current game creator
  setClients: Function; //All game clients update function
  clients: any[]; //All game clients
  activeClient: string; //Current active client
  providedWords: any[]; //Words list
  huddleClient: any; //Huddle client
}>({
  wsRef: null,
  clientRef: null,
  gameRef: null,
  socketState: null,
  name: "",
  setCreator: () => null,
  setClients: () => null,
  clients: [],
  creator: false,
  activeClient: "",
  providedWords: [],
  huddleClient: null,
});

const App = () => {
  const wsRef = useRef<any>(null);
  const clientRef = useRef<any>(null);
  const gameRef = useRef<any>(null);
  const name = useRef<any>("");

  const [socketState, setSocketState] = useState<any>(null);
  const [creator, setCreator] = useState<any>(false);
  const [clients, setClients] = useState<any>([]);
  const [activeClient, setActiveClient] = useState<any>(null);
  const [providedWords, setProvidedWords] = useState<any>([]);

  const huddleClient = getHuddleClient(process.env.REACT_APP_HUDDLE_KEY);
  const navigate = useNavigate();

  useEffect(() => {
    // let ws = new WebSocket(
    //   "wss://skribble-backend-mrmischievousx.onrender.com"
    // );
    let ws = new WebSocket("ws://localhost:8080");
    ws.onmessage = (message) => {
      const response = JSON.parse(message.data);

      switch (response.method) {
        case "connect": {
          clientRef.current = response.clientId;
          break;
        }

        case "create": {
          gameRef.current = response.id;
          setCreator(true);
          joinRoom(name.current, { id: name.current }, wsRef, clientRef);
          break;
        }

        case "join": {
          gameRef.current = response.id;
          setTimeout(() => {
            navigate("/lobby");
          }, 100);
          break;
        }

        case "start": {
          setClients(response.clients);
          navigate("/game");
          break;
        }

        case "startPoint": {
          setSocketState(response);
          break;
        }

        case "update": {
          setSocketState(response);
          break;
        }

        case "closePoint": {
          setSocketState(response);
          break;
        }

        case "allotChance": {
          setActiveClient(response.clientId);
          setProvidedWords(response.words);
          break;
        }

        case "updateScore": {
          const order = response.clients.sort((a: any, b: any) => {
            return b.score - a.score;
          });
          setClients(order);
          break;
        }

        case "error": {
          if (response.code == 1) alert(response.message);
          else if (response.code == 2)
            navigate("/error", {
              state: { error: response.error, message: response.message },
            });
          break;
        }
      }
    };

    wsRef.current = ws;
  }, []);

  return (
    <HuddleClientProvider value={huddleClient}>
      <Context.Provider
        value={{
          wsRef,
          clientRef,
          gameRef,
          socketState,
          name,
          creator,
          setCreator,
          clients,
          setClients,
          activeClient,
          providedWords,
          huddleClient,
        }}
      >
        <Routes>
          <Route path="/" element={<Homepage />}></Route>
          <Route path="/join/:id" element={<Homepage isJoin={true} />}></Route>
          <Route path="/lobby" element={<Lobby />}></Route>
          <Route path="/game" element={<Main />}></Route>
          <Route path="/error" element={<Error />}></Route>
        </Routes>
      </Context.Provider>
    </HuddleClientProvider>
  );
};

export default App;
