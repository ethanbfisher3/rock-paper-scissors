const Room = require('./room')
const { sleep } = require('../utils')

const ROCK = 1
const PAPER = 2

let matchNum = 0

/**
 * A single game of rock paper scissors between two clients.
 * Gets their choices between the 3 and calculates who won
 */

class Match extends Room {
  constructor(waitingRoom) {
    super(`m-${++matchNum}`, 2, 'match')
    this.waitingRoom = waitingRoom
    this.data.result = null
    this.data.disconnectedLoser = null
  }

  async onPlayerChoose(data) {
    if (!data.choice) return

    const players = Object.values(this.data.players)
    if (players[0].choice && players[1].choice) {
      this.data.result = this.getWinnerAndLoser(players)
      players.forEach((player) => (player.choice = null))
      this.emit()

      // make a new match if there's a tie
      if (!this.data.result.winner) {
        await sleep(2500)
        const match = new Match()
        this.sendPlayersToRoom(this.data.players, match)
        match.emit()
      }

      // otherwise, return the winner to wait in the lobby
      else this.onWin()
    }
  }

  onWin() {
    const winner = this.data.players[this.data.result.winner]
    sleep(2500)
      .then(() => {
        this.emit()

        // check if they've won the whole tournament
        if (this.waitingRoom.isTournamentWinner(winner)) {
          // delete the waiting room holding the tournament
          this.waitingRoom.deleteRoom()

          this.sendMessage(winner.id, {
            type: 'success',
            text: 'You won the tournament!',
          })
          this.sendPlayersToRoom({ winner }, null)
        }

        // only tell them they're advancing if they haven't won the whole thing
        else {
          this.sendPlayersToRoom({ winner }, this.waitingRoom)
          this.waitingRoom.sendMessage(winner.id, {
            type: 'success',
            text: 'You won. Advancing to the next round.',
          })
          this.waitingRoom.updateMatchups()
          this.waitingRoom.emit()
        }

        // make sure loser exists bc loser may have disconnected
        if (!this.data.disconnectedLoser) {
          const loser = this.data.players[this.data.result.loser]
          loser.choice = null

          this.sendMessage(loser.id, { type: 'error', text: 'You lost.' })
          this.sendPlayersToRoom({ loser }, null)
        }
      })
      .catch((err) => console.error(err))
  }

  connectPlayer(player, socket) {
    if (!super.connectPlayer(player, socket)) return false

    socket.on('set-data', (data) => this.onPlayerChoose(data))
    return true
  }

  disconnectPlayer(player) {
    if (!this.data.result) this.data.disconnectedLoser = player
    super.disconnectPlayer(player)

    if (!this.data.result) {
      this.data.result = {
        winner: Object.keys(this.data.players)[0],
        loser: player.id,
      }
      this.emit()
      this.onWin()
    }
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
}

module.exports = Match
