import LinearToTree, { NodeItem, TreeNode } from '../index'

describe('[3. Create Tree from flat data]', () => {
  test('should normal conversion to tree structure data', () => {
    const input: NodeItem[] = [
      { id: 1, name: 'i1' },
      { id: 2, name: 'i2', parentId: 1 },
      { id: 4, name: 'i4', parentId: 3 },
      { id: 3, name: 'i3', parentId: 2 },
      { id: 8, name: 'i8', parentId: 7 },
    ]

    const output: TreeNode[] = [
      {
        id: 1,
        name: 'i1',
        children: [
          {
            id: 2,
            name: 'i2',
            parentId: 1,
            children: [
              {
                id: 3,
                name: 'i3',
                parentId: 2,
                children: [
                  {
                    id: 4,
                    name: 'i4',
                    parentId: 3,
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ]
    expect(LinearToTree(input)).toEqual(output)
  })

  describe('input check', () => {
    test('should throw input type error', () => {
      try {
        // @ts-ignore
        LinearToTree(123)
        expect(true).toBe(false)
      }
      catch (e) {
        expect(e.message).toBe('[LinearToTree]: The input data should be an array.')
      }
    })

    test('should throw element should have \'id\' and its value should be of type Number', () => {
      try {
        // @ts-ignore
        LinearToTree([{ name: '123' }])
        // @ts-ignore
        LinearToTree([{ id: '123', name: '123' }])
        expect(true).toBe(false)
      }
      catch (e) {
        expect(e.message).toBe('[LinearToTree]: The data element should have a key value called \'id\' and its value should be of type Number.')
      }
    })

    test('should not allow the same \'id\'', () => {
      try {
        // @ts-ignore
        LinearToTree([{ id: 1, name: 'i1' }, { id: 1, name: 'i2' }])
        expect(true).toBe(false)
      }
      catch (e) {
        expect(e.message).toBe('[LinearToTree]: There are elements with the same \'id\', This is not allowed.')
      }
    })

    test('should throw element should have \'name\' and its value should be of type String', () => {
      try {
        // @ts-ignore
        LinearToTree([{ id: 1 }])
        // @ts-ignore
        LinearToTree([{ id: 1, name: 123 }])
        expect(true).toBe(false)
      }
      catch (e) {
        expect(e.message).toBe('[LinearToTree]: The data element should have a key value called \'name\' and its value should be of type String.')
      }
    })

    test('should throw \'parentId\' must be of type Number', () => {
      try {
        // @ts-ignore
        LinearToTree([{ id: 1, name: 'i1', parentId: '123' }])
        expect(true).toBe(false)
      }
      catch (e) {
        expect(e.message).toBe('[LinearToTree]: The \'parentId\' of the data element should be of type Number.')
      }
    })
  })
})
