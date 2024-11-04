import styled from 'styled-components'
import { useSocket } from '../contexts/SocketProvider'
import { useState, useEffect } from 'react'
import { sleep } from '../utils'

const getColorFromType = (type) => {
  if (type === 'success') return '#0F0'
  if (type === 'warning') return '#FF0'
  return '#F00'
}

const Container = styled.div`
  background-color: ${({ type }) => getColorFromType(type)};
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin: -10px;
  margin-bottom: 10px;
  width: 100%;
`

const Message = () => {
  const socket = useSocket()
  const [message, setMessage] = useState()

  useEffect(() => {
    socket?.on('message', (message) => {
      setMessage(message)
      sleep(3000).then(() => {
        setMessage(null)
      })
    })
  }, [socket])

  return message ? (
    <Container type={message.type}>
      <div>{message.text}</div>
    </Container>
  ) : null
}

export default Message
