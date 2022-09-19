import React, {  useContext, useMemo, useState } from "react";
import io from 'socket.io-client';

export const SocketContext = React.createContext()

export function SocketProvider(props) {
    const [socket, setSocket] = useState(process.env.NODE_ENV !== 'production' ? io('http://192.168.0.54:8081') : io());

    const value = useMemo(() => {
        return({
            socket
        });
    }, [socket]);

    return <SocketContext.Provider value={value}>
        {props.children}
    </SocketContext.Provider>
}

export const useSocket = () => {
    const context = useContext(SocketContext);
    if(!context){
        throw new Error('useContext must be in SocketContext provider');
    }
    return context;
}