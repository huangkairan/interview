/**
 * Time: 2021.08.12 20:00 - 2021.08.12 20:56
 */

import xlsx from 'xlsx'
import TeamHeap, { resultArr, TeamResult, TeamScore } from './Heap'

class Tournament {
  private teamHeap = new TeamHeap()

  input(record: string): Tournament {
    if (!record || typeof record !== 'string' || record.split(';').length !== 3)
      return this

    let [teamA, teamB, result] = record.split(';')
    teamA = teamA.trim()
    teamB = teamB.trim()
    result = result.trim()

    if (!teamA || !teamB || !resultArr.includes(result))
      return this

    const [teamAResult, teamBResult] = TeamResult[result]

    this.teamHeap.update(teamA, teamAResult)
    this.teamHeap.update(teamB, teamBResult)

    return this
  }

  output(): TeamScore[] {
    const result: TeamScore[] = []
    const tempHeap = new TeamHeap(this.teamHeap.teams.slice(), new Map(this.teamHeap.nameIdxMap))

    while (tempHeap.size)
      result.push(tempHeap.poll()!)

    return result
  }

  generateFile(): string {
    const fileName = `${Date.now()}`
    xlsx.writeFile({
      SheetNames: ['main'],
      Sheets: {
        main: xlsx.utils.json_to_sheet(this.output()),
      },
    }, `./${fileName}.xlsx`)
    return fileName
  }
}

export default Tournament
