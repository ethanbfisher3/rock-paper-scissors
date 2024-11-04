const WaitingRoom = require('./waitingRoom')
const Player = require('./player')
const Room = require('./room')
const { sleep } = require('./utils')

const INTERMISSION = 'Intermission'
const STARTING = 'Starting'
const WAITING = 'Waiting'
const GETTING_INPUT = 'Getting Input'

const ROCK = 1
const PAPER = 2

const START_TIME = 0

/**
 * An entire tournament for rock paper scissors.
 * This will direct clients to different matches
 */

class Lobby extends Room {
  constructor(name, io) {
    super(name, io, 2, 'lobby')
    this.data = {
      ...this.data,
      timeToStart: START_TIME,
      state: INTERMISSION,
      result: null,
    }
  }

  setStateAndEmit(state) {
    this.data.state = state
    this.emit()
  }

  async waitForInput() {
    this.setStateAndEmit(GETTING_INPUT)
    while (true) {
      await sleep(1000)
      var choicesPicked = true
      for (let key in this.data.players) {
        if (!this.data.players[key].choice) choicesPicked = false
      }
      if (choicesPicked) break
    }
    this.setStateAndEmit(WAITING)
  }

  getWinnerAndLoser([playerOne, playerTwo]) {
    const choiceOne = playerOne.choice
    const id1 = playerOne.id
    const choiceTwo = playerTwo.choice
    const id2 = playerTwo.id
    if (choiceOne == ROCK) {
      if (choiceTwo == ROCK) return { winner: null, loser: null }

      if (choiceTwo == PAPER) return { winner: id2, loser: id1 }

      return { winner: id1, loser: id2 }
    }
    if (choiceOne == PAPER) {
      if (choiceTwo == ROCK) return { winner: id1, loser: id2 }

      if (choiceTwo == PAPER) return { winner: null, loser: null }

      return { winner: id2, loser: id1 }
    }
    if (choiceTwo == ROCK) return { winner: id2, loser: id1 }

    if (choiceTwo == PAPER) return { winner: id1, loser: id2 }

    return { winner: null, loser: null }
  }

  async runGameLoop() {
    this.setStateAndEmit(WAITING)

    await this.waitForInput()

    const players = []
    Object.values(this.data.players).forEach((player) => players.push(player))

    this.data.result = this.getWinnerAndLoser(players)
    this.emit()
    this.disconnectAllSockets()
  }

  disconnectAllSockets() {
    this.data.players = {}
    this.data.state = INTERMISSION
    this.data.result = null
    Object.values(io.sockets.adapter.rooms[this.data.name].sockets).forEach(
      (socket) => socket.disconnect()
    )
  }

  checkStarting() {
    if (!this.isFull() || this.data.state !== INTERMISSION) return
    for (const id in this.data.players) if (!this.data.players[id].ready) return
    this.data.state = STARTING
    this.beginStartingSequence()
  }

  async beginStartingSequence() {
    //await sleep(3000)
    for (var i = 0; i < START_TIME; i++) {
      this.emit()
      this.data.timeToStart -= 1
      await sleep(1000)
    }
    await this.runGameLoop()
  }

  disconnectPlayer(id) {
    if (super.disconnectPlayer(id)) {
      const player = Object.values(this.data.players)[0]
      if (player) {
        player.ready = false
        player.choice = 0
      }
      this.data.state = INTERMISSION
      return true
    }
    return false
  }
}

module.exports = Lobby
