export const getPlayerName = (socket, player) => {
  if (player.id === socket.id) return player.name + ' (You)'
  return player.name
}

export const getChoiceAsString = (choice) => {
  if (choice === 1) return 'Rock'
  return choice === 2 ? 'Paper' : 'Scissors'
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
