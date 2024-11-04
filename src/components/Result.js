import { getPlayerName } from '../utils'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
`

const Text = styled.div`
  font-size: 24px;
`

const Result = ({ socket, room }) =>
  room.result.winner ? (
    <Container>
      <Text>
        Winner: {getPlayerName(socket, room.players[room.result.winner])}
      </Text>
      <Text>
        Loser:{' '}
        {getPlayerName(
          socket,
          room.disconnectedLoser || room.players[room.result.loser]
        )}
        {room.disconnectedLoser ? ' (Disconnected)' : ''}
      </Text>
    </Container>
  ) : (
    <Container>
      <Text>Tie Game!</Text>
    </Container>
  )

export default Result
