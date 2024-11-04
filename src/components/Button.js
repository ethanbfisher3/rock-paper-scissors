import styled from 'styled-components'

const MainButton = styled.button`
  font-family: inherit;
  padding: 10px;
  color: white;
  border: none;
  width: 50%;
  max-width: 200px;
  height: 50px;
  font-size: 20px;
  border-radius: 5px;
  border-color: blue;
  color: white;
  transition: all 150ms ease-in-out;
  background-color: blue;

  &:hover {
    background-color: darkblue;
    cursor: pointer;
  }

  /* box-shadow: 0 0 40px 40px blue inset, 0 0 0 0 blue;

  &:hover {
    cursor: pointer;
    box-shadow: 0 0 10px 0 blue inset, 0 0 10px 4px blue;
    color: black;
  } */
`

export default MainButton
