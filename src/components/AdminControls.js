import styled from 'styled-components'
import MainButton from './Button'

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const Button = styled(MainButton)`
  margin: 20px;
`

const updatePublicPrivate = (socket, room) =>
  socket.emit('set-private', !room._private)

const AdminControls = ({ socket, room }) => (
  <Container>
    <Button onClick={() => updatePublicPrivate(socket, room)}>
      {room._private ? 'Private' : 'Public'}
    </Button>
    {Object.keys(room.players).length === room.maxPlayers ? (
      <Button onClick={() => socket.emit('start-game')}>Start</Button>
    ) : null}
  </Container>
)

export default AdminControls
