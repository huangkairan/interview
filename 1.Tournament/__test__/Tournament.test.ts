import Tournament from '../'
import getExcelFileContext from './getExcelFileContext'

describe('[1. Tournament]', () => {
  test('should rank the team normally', () => {
    const input = [
      'Allegoric Alaskans;Blithering Badgers;win',
      'Devastating Donkeys;Courageous Californians;draw',
      'Devastating Donkeys;Allegoric Alaskans;win',
      'Courageous Californians;Blithering Badgers;loss',
      'Blithering Badgers;Devastating Donkeys;loss',
      'Allegoric Alaskans;Courageous Californians;win',
    ]

    const tournament = new Tournament()
    for (let i = 0; i < input.length; i++)
      tournament.input(input[i])

    expect(tournament.output()).toEqual([
      { Team: 'Devastating Donkeys', MP: 3, W: 2, D: 1, L: 0, P: 7 },
      { Team: 'Allegoric Alaskans', MP: 3, W: 2, D: 0, L: 1, P: 6 },
      { Team: 'Blithering Badgers', MP: 3, W: 1, D: 0, L: 2, P: 3 },
      { Team: 'Courageous Californians', MP: 3, W: 0, D: 1, L: 2, P: 1 },
    ])
  })

  test('should ignore invalid input', () => {
    const input = [
      1111111, // ignore
      'Allegoric Alaskans;Blithering Badgers;win',
      'Allegoric Alaskans;Blithering Badgers;win&loss&draw', // ignore
      'Devastating Donkeys;Courageous Californians;draw',
      'Devastating Donkeys;     ;win', // ignore
      'Devastating Donkeys;Allegoric Alaskans;win',
      'Courageous Californians;Blithering Badgers;loss',
      'Blithering Badgers;Devastating Donkeys;loss',
      'Blithering Badgers;loss', // ignore
      'Allegoric Alaskans;Courageous Californians;win',
    ] as string[]

    const tournament = new Tournament()
    for (let i = 0; i < input.length; i++)
      tournament.input(input[i])

    expect(tournament.output()).toEqual([
      { Team: 'Devastating Donkeys', MP: 3, W: 2, D: 1, L: 0, P: 7 },
      { Team: 'Allegoric Alaskans', MP: 3, W: 2, D: 0, L: 1, P: 6 },
      { Team: 'Blithering Badgers', MP: 3, W: 1, D: 0, L: 2, P: 3 },
      { Team: 'Courageous Californians', MP: 3, W: 0, D: 1, L: 2, P: 1 },
    ])
  })

  test('should be able to output the correct ranking halfway', () => {
    const tournament = new Tournament()

    tournament
      .input('Allegoric Alaskans;Blithering Badgers;win')
      .input('Devastating Donkeys;Courageous Californians;draw')
      .input('Devastating Donkeys;Allegoric Alaskans;win')

    expect(tournament.output()).toEqual([
      { Team: 'Devastating Donkeys', MP: 2, W: 1, D: 1, L: 0, P: 4 },
      { Team: 'Allegoric Alaskans', MP: 2, W: 1, D: 0, L: 1, P: 3 },
      { Team: 'Courageous Californians', MP: 1, W: 0, D: 1, L: 0, P: 1 },
      { Team: 'Blithering Badgers', MP: 1, W: 0, D: 0, L: 1, P: 0 },
    ])

    tournament
      .input('Courageous Californians;Blithering Badgers;loss')
      .input('Blithering Badgers;Devastating Donkeys;loss')
      .input('Allegoric Alaskans;Courageous Californians;win')

    expect(tournament.output()).toEqual([
      { Team: 'Devastating Donkeys', MP: 3, W: 2, D: 1, L: 0, P: 7 },
      { Team: 'Allegoric Alaskans', MP: 3, W: 2, D: 0, L: 1, P: 6 },
      { Team: 'Blithering Badgers', MP: 3, W: 1, D: 0, L: 2, P: 3 },
      { Team: 'Courageous Californians', MP: 3, W: 0, D: 1, L: 2, P: 1 },
    ])
  })

  test('should generated xlsx file and the content is correct', () => {
    const input = [
      'Allegoric Alaskans;Blithering Badgers;win',
      'Devastating Donkeys;Courageous Californians;draw',
      'Devastating Donkeys;Allegoric Alaskans;win',
      'Courageous Californians;Blithering Badgers;loss',
      'Blithering Badgers;Devastating Donkeys;loss',
      'Allegoric Alaskans;Courageous Californians;win',
    ]

    const tournament = new Tournament()
    for (let i = 0; i < input.length; i++)
      tournament.input(input[i])

    const fileName = tournament.generateFile()
    const result = getExcelFileContext(fileName)

    expect(result).toEqual([
      { Team: 'Devastating Donkeys', MP: 3, W: 2, D: 1, L: 0, P: 7 },
      { Team: 'Allegoric Alaskans', MP: 3, W: 2, D: 0, L: 1, P: 6 },
      { Team: 'Blithering Badgers', MP: 3, W: 1, D: 0, L: 2, P: 3 },
      { Team: 'Courageous Californians', MP: 3, W: 0, D: 1, L: 2, P: 1 },
    ])
  })
})
