// import useLocalStorage from '../hooks/useLocalStorage'
import styled from 'styled-components'
import { useSocket } from '../contexts/SocketProvider'
import { useEffect, useState } from 'react'
// import InputName from '../components/InputName'

import Homepage from '../screens/Homepage'
import WaitingRoom from '../components/WaitingRoom'
import GetChoice from '../components/GetChoice'
import Result from '../components/Result'
import Message from '../components/Message'

const Container = styled.div``

const renderRoom = (room, data) => {
  switch (room.type) {
    case 'waiting-room':
      return <WaitingRoom {...data} />
    case 'match':
      return room.result ? (
        <Result {...data} />
      ) : (
        <GetChoice
          onChoiceSet={(choice) => data.socket.emit('set-data', { choice })}
          choice={room.players[data.socket.id].choice}
          {...data}
        />
      )
    default:
      return <div></div>
  }
}

const Game = () => {
  // const [name] = useLocalStorage('name')
  const [room, setRoom] = useState(null)
  // const [playing, setPlaying] = useState(false)
  const socket = useSocket()

  const data = {
    socket,
    room,
  }

  useEffect(() => {
    socket?.on('room', (room) => setRoom(room))
  }, [socket])

  return (
    <Container>
      <Message />
      {room ? renderRoom(room, data) : <Homepage />}
    </Container>
  )

  // if (!name || !playing) return <InputName onNameSet={() => setPlaying(true)} />
}

export default Game
