import { useState, useEffect } from "react";
import io from "socket.io-client";

export const useSocket = (url: string, onEvent: string, initState: [] | {}): any => {
  const [data, setData] = useState<typeof initState>(initState);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const socket = io(url).connect();

    socket.on("connect", () => {
      console.log(`Connected to server ${url}: listening ${onEvent}`);
      setIsConnected(true);

      socket.on(onEvent, data => {
        setData(data);
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.off(onEvent);
      socket.disconnect();
    };
  }, [url]);

  return { data, isConnected };
};
