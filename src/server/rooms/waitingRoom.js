const Room = require('./room')
const Match = require('./match')
const { sleep } = require('../utils')
const createBracket = require('../brackets')

const START_TIME = 120

let numRooms = 0
let rooms = []
let roomIndex = 0
let room

/**
 * Holds clients that have yet to enter a match
 */

class WaitingRoom extends Room {
  static currentRoom() {
    if (room.isFull() || !room.open || room.data._private) {
      for (let index = 0; index < rooms.length; index++) {
        const curRoom = rooms[index]
        if (!curRoom.isFull() && curRoom.open && !curRoom.data._private) {
          roomIndex = index
          room = rooms[roomIndex]
          return room
        }
      }

      roomIndex = rooms.length
      rooms.push(new WaitingRoom(`Waiting Room - ${++numRooms}`))
      room = rooms[roomIndex]
    }
    return room
  }

  static currentRoomOfSize(size) {
    if (
      room.isFull() ||
      !room.open ||
      room.data._private ||
      room.data.maxPlayers != size
    ) {
      for (let index = 0; index < rooms.length; index++) {
        const curRoom = rooms[index]
        if (
          !curRoom.isFull() &&
          curRoom.open &&
          !curRoom.data._private &&
          curRoom.data.maxPlayers === size
        ) {
          roomIndex = index
          room = rooms[roomIndex]
          return room
        }
      }

      roomIndex = rooms.length
      rooms.push(new WaitingRoom(`Waiting Room - ${++numRooms}`, size))
      room = rooms[roomIndex]
    }
    return room
  }

  static getRoom(roomName) {
    for (const r of rooms) {
      if (r.data.name === roomName) return r
    }
  }

  static createRoom(name, size, adminId) {
    room = new WaitingRoom(name, size, true)
    room.data.adminId = adminId
    rooms.push(room)
    roomIndex = rooms.length - 1
    return room
  }

  constructor(name, size = 16, _private = false) {
    super(name, size, 'waiting-room')
    this.data.timeToStart = null
    this.data._private = _private
    this.bracket = null
    this.open = true
  }

  deleteRoom() {
    const index = rooms.indexOf(this)
    rooms.splice(index, 1)
    if (roomIndex > index) roomIndex--
    room = WaitingRoom.currentRoom()
  }

  createMatches() {
    this.bracket = createBracket(Object.keys(this.data.players))

    const newMatchups = []
    this.bracket.matchups.forEach((matchup) => {
      const playerIds = matchup.players

      // if only one players, send them to another waiting room
      if (playerIds.length === 1) {
        const newRoom = WaitingRoom.currentRoom()
        this.sendPlayersToRoom({ id: this.data.players[playerIds[0]] }, newRoom)
        newRoom.sendMessage(playerIds[0], {
          type: 'warning',
          text: 'Could not find opponent due to an odd number of players',
        })
        newRoom.emit()
        return
      }

      // set player opponent ids
      const players = playerIds.map((id) => this.data.players[id])
      players[0].opponent = playerIds[1]
      players[1].opponent = playerIds[0]

      // create a match and send the players to the match
      const match = new Match(this)
      this.sendPlayersToRoom(players, match)
      match.emit()
      this.data.timeToStart = null

      newMatchups.push(match)
    })
    this.bracket.matchups = newMatchups
  }

  updateMatchups() {
    // make sure each match has completed
    for (const match of this.bracket.matchups) if (!match.data.result) return

    if (this.bracket.matchups.length === 1) return

    // make new matches
    this.createMatches()
  }

  isTournamentWinner(player) {
    return (
      this.bracket.matchups.length === 1 &&
      this.bracket.matchups[0].data.result.winner === player.id
    )
  }

  async startCountdown() {
    this.data.timeToStart = START_TIME

    while (true) {
      this.data.timeToStart -= 1
      this.emit()
      await sleep(1000)
      if (this.numPlayers < 2) {
        this.data.timeToStart = null
        this.open = true
        this.emit()
        return
      }
      this.open = this.data.timeToStart > 5
      if (this.data.timeToStart <= 0) break
    }

    this.createMatches()
    this.data.timeToStart = null
  }

  connectPlayer(player, socket) {
    if (!super.connectPlayer(player, socket)) return false

    socket.removeAllListeners('set-private')
    socket.removeAllListeners('start-game')
    socket.on('set-private', (_private) => {
      this.data._private = _private
      this.emit()
    })
    socket.on('start-game', () => {
      this.data.timeToStart = 0
    })

    if (!this.data.timeToStart && this.numPlayers >= 2) this.startCountdown()
    if (this.numPlayers === this.data.maxPlayers) {
      this.data.timeToStart = Math.min(5, this.data.timeToStart)
    } else if (
      this.numPlayers > 1 &&
      this.numPlayers === this.data.maxPlayers / 2
    )
      this.data.timeToStart = Math.min(START_TIME / 2, this.data.startTime)

    this.emit()
    return true
  }

  disconnectPlayer(player) {
    super.disconnectPlayer(player)
    if (this.numPlayers === 0) this.deleteRoom()
  }

  async beginStartingSequence() {
    for (var i = 0; i < START_TIME; i++) {
      this.emit()
      this.data.timeToStart -= 1
      await sleep(1000)
    }
    await this.runGameLoop()
  }
}

rooms.push(new WaitingRoom('Waiting Room - 1'))
room = rooms[0]

module.exports = WaitingRoom
