import styled from 'styled-components'
import { useState } from 'react'
import MainButton from './Button'
import { getChoiceAsString } from '../utils'

const OuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const InnerContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 900px;
  justify-content: center;
`

const ChoiceButton = styled.button`
  background: white;
  border: 2px solid ${({ selected }) => (selected ? 'black' : 'white')};
  border-radius: 25px;
  transition: all 150ms ease-in-out;
  width: 25%;
  aspect-ratio: 1;
  margin: 10px;
  &:hover {
    cursor: pointer;
    background-color: gray;
  }
`

const Button = styled(MainButton)`
  width: 50%;
  max-width: 100px;
  height: 50px;
  margin-top: 50px;
`

const Image = styled.img`
  max-width: 75%;
  max-height: 75%;
`

const ChoiceText = styled.div`
  position: absolute;
  width: 200px;
  font-size: 24px;
  text-align: center;
  left: calc(50vw - 100px);
  top: calc(50vh - 24px);
`

const OpponentText = styled.div`
  font-size: 24px;
  text-align: center;
  margin: 50px;
`

const GetChoice = ({ choice, onChoiceSet, room, socket }) => {
  const [selected, setSelected] = useState(null)

  const opponentName = room.players[room.players[socket.id].opponent].name

  if (choice)
    return <ChoiceText>You chose {getChoiceAsString(choice)}</ChoiceText>

  const Choice = ({ number, src }) => (
    <ChoiceButton
      onClick={() => setSelected(number)}
      selected={number === selected}
    >
      <Image src={src} />
    </ChoiceButton>
  )

  return (
    <OuterContainer>
      <OpponentText>Opponent: {opponentName}</OpponentText>
      <InnerContainer>
        <Choice number={1} src='rock.png' />
        <Choice number={2} src='paper.png' />
        <Choice number={3} src='scissors.png' />
      </InnerContainer>
      <Button
        onClick={() => {
          if (selected && !choice) onChoiceSet(selected)
        }}
      >
        Submit
      </Button>
    </OuterContainer>
  )
}

export default GetChoice
