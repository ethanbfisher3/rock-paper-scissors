class Player {
  constructor(socket) {
    this.name = null
    this.opponent = null
    this.id = socket.id
    this.choice = 0
  }
}

module.exports = Player
