import styled from 'styled-components'
import { getPlayerName } from '../utils'
import AdminControls from './AdminControls'

const OuterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const TopContainer = styled.div`
  margin-bottom: 50px;
  text-align: center;
`

const PlayersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StartingText = styled.div`
  width: 400px;
  font-size: 24px;
  text-align: center;
  position: absolute;
  left: calc(50% - 200px);
  bottom: 200px;
`

const WaitingRoom = ({ socket, room }) => {
  const { players, maxPlayers, timeToStart, name, adminId } = room
  const keys = Object.keys(players)
  return (
    <OuterContainer>
      <TopContainer>
        <h1>{name}</h1>
        <h2>Players</h2>
        <h3>
          ({keys.length} / {maxPlayers})
        </h3>
        <PlayersContainer>
          {keys.map((key) => (
            <div key={key}>{getPlayerName(socket, players[key])}</div>
          ))}
        </PlayersContainer>
      </TopContainer>
      {timeToStart ? (
        <StartingText>
          Starting in {timeToStart} second{timeToStart === 0 ? '' : 's'}...
        </StartingText>
      ) : null}
      {socket.id === adminId ? (
        <AdminControls socket={socket} room={room} />
      ) : null}
    </OuterContainer>
  )
}

export default WaitingRoom
