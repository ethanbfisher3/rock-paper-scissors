import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ id, children }) => {
  const [socket, setSocket] = useState()

  useEffect(() => {
    const newSocket = io(
      !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001'
        : '/',
      {
        query: { id },
      }
    )
    setSocket(newSocket)

    return () => newSocket.close()
  }, [id])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
