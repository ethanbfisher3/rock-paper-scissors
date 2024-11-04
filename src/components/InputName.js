import styled from 'styled-components'
import useLocalStorage from '../hooks/useLocalStorage'
import { useSocket } from '../contexts/SocketProvider'
import Button from './Button'

const Form = styled.form`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`

const Input = styled.input`
  padding: 5px;
  font-family: inherit;
  font-size: 24px;
  margin: 25px;
  border-radius: 5px;
  transition: all 150ms ease-in-out;
`

const Label = styled.label`
  font-size: 32px;
`

const Title = styled.h1`
  position: absolute;
  width: 500px;
  top: 100px;
  left: calc(50vw - 250px);
`

const handleSubmit = (e, setName, onNameSet, socket) => {
  e.preventDefault()

  const name = document.getElementsByName('name')[0].value
  setName(name)
  socket.emit('join', name)

  onNameSet()
}

const InputName = ({ onNameSet }) => {
  const [name, setName] = useLocalStorage('name')
  const socket = useSocket()

  return (
    <Form onSubmit={(e) => handleSubmit(e, setName, onNameSet, socket)}>
      <Title>Rock Paper Scissors Tournament</Title>
      <Label>Enter Name</Label>
      <Input name='name' type='text' defaultValue={name} required />
      {/* <select name='tournament-size'>
        <option name='large' value='16'>
          Large
        </option>
      </select> */}
      <Button type='submit'>Play</Button>
    </Form>
  )
}

export default InputName
