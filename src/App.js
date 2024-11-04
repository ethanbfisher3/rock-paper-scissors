import Game from './screens/Game'
import useLocalStorage from './hooks/useLocalStorage'
import { SocketProvider } from './contexts/SocketProvider'
import { v4 } from 'uuid'

const App = () => {
  const [id] = useLocalStorage('id', v4())

  return (
    <SocketProvider id={id}>
      <Game />
    </SocketProvider>
  )
}

export default App
