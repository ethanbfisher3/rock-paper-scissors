const { io } = require('../data')
const { sleep } = require('../utils')

class Room {
  constructor(name, maxPlayers, type) {
    this.sockets = {}
    this.numPlayers = 0
    this.data = {
      name,
      type,
      players: {},
      maxPlayers: parseInt(maxPlayers),
    }
  }

  connectPlayer(player, socket) {
    if (
      Object.keys(this.data.players).length >= this.data.maxPlayers ||
      this.data.players[socket.id]
    )
      return false
    this.numPlayers++
    this.data.players[player.id] = player
    this.sockets[socket.id] = socket
    socket.join(this.data.name)
    socket.removeAllListeners('set-data')
    socket.on('set-data', (data) => {
      for (const key in data) player[key] = data[key]
      this.emit()
    })
    socket.removeAllListeners('disconnect')
    socket.on('disconnect', () => this.disconnectPlayer(player))
    return true
  }

  disconnectPlayer(player) {
    if (!this.data.players[player.id]) return
    const id = player.id
    this.numPlayers--
    this.sockets[id].leave(this.data.name)
    delete this.data.players[id]
    delete this.sockets[id]
  }

  sendPlayersToRoom(players, room) {
    Object.values(players).forEach((player) => {
      if (room) {
        const socket = this.sockets[player.id]
        this.disconnectPlayer(player)
        room.connectPlayer(player, socket)
      } else this.sockets[player.id].emit('room', null)
    })
  }

  emit() {
    io.to(this.data.name).emit('room', this.data)
  }

  sendMessage(to, message, callback) {
    this.sockets[to].emit('message', message)
  }

  isFull = () => this.numPlayers >= this.data.maxPlayers
}

module.exports = Room
