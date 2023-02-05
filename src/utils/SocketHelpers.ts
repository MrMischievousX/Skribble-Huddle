export const joinRoom = (
  name: string,
  params: any,
  wsRef: any,
  clientRef: any
) => {
  console.log(name);
  if (!name || name.length <= 4) {
    alert("Enter Valid Name");
    return;
  }

  if (!params.id) {
    alert("Joining Link is Invalid");
    return;
  }

  let payload = {
    method: "join",
    clientId: clientRef.current,
    gameId: params.id,
    name: name,
  };

  wsRef.current.send(JSON.stringify(payload));
};

export const createRoom = (
  userName: string,
  name: any,
  wsRef: any,
  clientRef: any
) => {
  if (!name || name.length <= 4) {
    alert("Enter Valid Name");
    return;
  }

  name.current = userName;

  let payload = {
    method: "create",
    clientId: clientRef.current,
    name: userName,
  };

  wsRef.current.send(JSON.stringify(payload));
};
