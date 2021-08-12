export interface TeamScore {
  Team: string
  MP: number
  W: number
  D: number
  L: number
  P: number
}

export const resultArr = ['win', 'draw', 'loss']
export const TeamResult: Record<string, [string, string]> = {
  win: ['win', 'loss'],
  draw: ['draw', 'draw'],
  loss: ['loss', 'win'],
}

class TeamHeap {
  teams: TeamScore[]
  nameIdxMap: Map<string, number>

  constructor(teams: TeamScore[] = [], map: Map<string, number> = new Map()) {
    this.teams = teams
    this.nameIdxMap = map
  }

  update(teamName: string, result: string): TeamScore {
    let teamScore: TeamScore
    let idx: number
    if (!this.nameIdxMap.has(teamName)) {
      teamScore = this.createTeam(teamName)
      this.teams.push(teamScore)
      idx = this.size - 1
      this.nameIdxMap.set(teamName, this.size - 1)
    }
    else {
      idx = this.nameIdxMap.get(teamName)!
      teamScore = this.teams[idx]
    }

    teamScore.MP += 1
    switch (result) {
      case 'win':
        teamScore.W += 1
        teamScore.P += 3
        break
      case 'draw':
        teamScore.D += 1
        teamScore.P += 1
        break
      case 'loss':
        teamScore.L += 1
        break
    }

    this.shiftUp(idx)
    return teamScore
  }

  poll(): TeamScore | undefined {
    if (!this.size) return undefined
    const peekValue = this.teams.shift()!
    if (this.size) {
      const latest = this.teams.pop()!
      this.teams.unshift(latest)
      this.nameIdxMap.set(latest.Team, 0)
      this.shiftDown(0)
    }
    return peekValue
  }

  private shiftUp(index: number) {
    let parentIndex = (index - 1) >> 1
    while (index && !this.compare(this.teams[parentIndex], this.teams[index])) {
      this.swap(parentIndex, index)
      index = parentIndex
      parentIndex = (index - 1) >> 1
    }
  }

  private shiftDown(index: number) {
    let left = index * 2 + 1
    let right = (index + 1) * 2
    while (left <= this.size - 1) {
      let nextIndex = index
      if (!this.compare(this.teams[nextIndex], this.teams[left]))
        nextIndex = left

      if (right <= this.size - 1 && !this.compare(this.teams[nextIndex], this.teams[right]))
        nextIndex = right

      if (nextIndex === index) {
        return index
      }
      else {
        this.swap(nextIndex, index)
        index = nextIndex
        left = index * 2 + 1
        right = (index + 1) * 2
      }
    }
    return index
  }

  private swap(team1: number, team2: number) {
    this.nameIdxMap.set(this.teams[team1].Team, team2)
    this.nameIdxMap.set(this.teams[team2].Team, team1);
    [this.teams[team1], this.teams[team2]] = [this.teams[team2], this.teams[team1]]
  }

  private compare(teamA: TeamScore, teamB: TeamScore): boolean {
    if (teamA.P !== teamB.P)
      return teamA.P > teamB.P

    if (teamA.Team.length > teamB.Team.length && teamA.Team.indexOf(teamB.Team) === 0)
      return false
    if (teamB.Team.length > teamA.Team.length && teamB.Team.indexOf(teamA.Team) === 0)
      return true

    return teamA.Team < teamB.Team
  }

  private createTeam(name: string): TeamScore {
    return {
      Team: name,
      MP: 0,
      W: 0,
      D: 0,
      L: 0,
      P: 0,
    }
  }

  get peek() {
    return this.teams[0]
  }

  get size() {
    return this.teams.length
  }
}

export default TeamHeap
