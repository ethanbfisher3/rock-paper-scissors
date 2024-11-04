const { io } = require('./data')

const WaitingRoom = require('./rooms/waitingRoom')
const Player = require('./player')

io.on('connection', (socket) => {
  const player = new Player(socket)

  socket.on('quick-play', (playerName, roomSize) => {
    player.name = playerName
    const room = WaitingRoom.currentRoomOfSize(parseInt(roomSize))
    room.connectPlayer(player, socket)
    socket.emit('message', {
      type: 'success',
      text: `Joined room ${room.data.name}`,
    })
  })

  socket.on('join-room', (playerName, roomName) => {
    player.name = playerName
    const room = WaitingRoom.getRoom(roomName)
    if (room) {
      if (!room.open) {
        socket.emit('message', {
          type: 'warning',
          text: `Room ${roomName} is already in progress.`,
        })
        return
      }
      if (room.isFull()) {
        socket.emit('message', {
          type: 'warning',
          text: `Room ${roomName} is full.`,
        })
      }
      room.connectPlayer(player, socket)
      socket.emit('message', {
        type: 'success',
        text: `Successfully joined room ${roomName}.`,
      })
      room.emit()
    } else {
      socket.emit('message', {
        type: 'warning',
        text: `Room with name ${roomName} does not exist.`,
      })
    }
  })

  socket.on('create-room', (playerName, roomName, roomSize) => {
    player.name = playerName
    if (WaitingRoom.getRoom(roomName)) {
      socket.emit('message', {
        type: 'warning',
        text: `Room with name ${roomName} already exists.`,
      })
    } else {
      const room = WaitingRoom.createRoom(roomName, roomSize, player.id)
      room.connectPlayer(player, socket)
      socket.emit('message', {
        type: 'success',
        text: `Created room ${roomName}.`,
      })
      room.emit()
    }
  })
})
