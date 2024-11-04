import styled from 'styled-components'
import { useSocket } from '../contexts/SocketProvider'
import MainButton from '../components/Button'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

const Header = styled.div`
  text-align: center;
  font-size: 32px;
  font-weight: bold;
  margin: 50px;
`

const Section = styled.section`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  font-size: 20px;
`

const Fieldset = styled.fieldset`
  padding: 25px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
  margin: 50px;
  margin-top: 0px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  align-items: center;
`

const Input = styled.input`
  margin-bottom: 20px;
  margin-top: 10px;
  height: 30px;
  width: 70%;
`

const Button = styled(MainButton)`
  width: 200px;
  margin-bottom: 20px;
  height: 75px;
`

const createRoom = (e, socket) => {
  e.preventDefault()

  socket.emit(
    'create-room',
    e.target['player-name'].value,
    e.target['create-name'].value,
    parseInt(e.target['room-size'].value)
  )
}

const joinRoom = (e, socket) => {
  e.preventDefault()

  socket.emit(
    'join-room',
    e.target['player-name'].value,
    e.target['join-name'].value
  )
}

const quickPlay = (e, socket) => {
  e.preventDefault()

  socket.emit(
    'quick-play',
    e.target['player-name'].value,
    e.target['room-size'].value
  )
}

const Homepage = () => {
  const socket = useSocket()
  return (
    <Container>
      <Header>Rock Paper Scissors Tournament</Header>
      <Section>
        <Fieldset>
          <legend>Create Room</legend>
          <Form
            name='create'
            id='create'
            onSubmit={(e) => createRoom(e, socket)}
          >
            <label htmlFor='player-name'>Player Name</label>
            <Input type='text' id='player-name' name='player-name' required />
            <label htmlFor='create-name'>Room Name</label>
            <Input id='create-name' type='text' name='create-name' required />
            <label htmlFor='room-size'>Room Size</label>
            <Input as='select' id='room-size' name='room-size' required>
              <option name='2'>2</option>
              <option name='4'>4</option>
              <option name='8'>8</option>
              <option name='16'>16</option>
            </Input>
            <Button type='submit' form='create'>
              Create Room
            </Button>
          </Form>
        </Fieldset>
        <Fieldset>
          <legend>Join Room</legend>
          <Form name='join' id='join' onSubmit={(e) => joinRoom(e, socket)}>
            <label htmlFor='player-name'>Player Name</label>
            <Input type='text' id='player-name' name='player-name' required />
            <label htmlFor='join-name'>Room Name</label>
            <Input id='join-name' type='text' name='join-name' required />
            <Button type='submit' form='join'>
              Join Room
            </Button>
          </Form>
        </Fieldset>
        <Fieldset>
          <legend>Quick Play</legend>
          <Form
            name='quick-play'
            id='quick-play'
            onSubmit={(e) => quickPlay(e, socket)}
          >
            <label htmlFor='player-name'>Player Name</label>
            <Input type='text' id='player-name' name='player-name' required />
            <label htmlFor='room-size'>Room Size</label>
            <Input as='select' id='room-size' name='room-size' required>
              <option name='2'>2</option>
              <option name='4'>4</option>
              <option name='8'>8</option>
              <option name='16'>16</option>
            </Input>
            <Button type='submit' form='quick-play'>
              Quick Play
            </Button>
          </Form>
        </Fieldset>
      </Section>
    </Container>
  )
}

export default Homepage
