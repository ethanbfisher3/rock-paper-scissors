const createBracket = (members) => {
  const bracket = new Bracket()
  for (var i = 0; i < members.length; i += 2) {
    if (members[i + 1])
      bracket.matchups.push(new Matchup([members[i], members[i + 1]]))
    else bracket.matchups.push(new Matchup([members[i]]))
  }
  return bracket
}

class Bracket {
  constructor() {
    this.matchups = []
  }
}

class Matchup {
  constructor(players) {
    this.players = players
    this.winner = null
    this.loser = null
  }
}

module.exports = createBracket
