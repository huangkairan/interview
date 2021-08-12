/**
 * Time: 2021.08.11 21:00 - 2021.08.11 22:00
 */

export interface NodeItem {
  id: number
  name: string
  parentId?: number
  [p: string]: unknown
}

export interface TreeNode extends NodeItem {
  children: TreeNode[]
}

function isPlainObject(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false
  let proto = value
  while (Object.getPrototypeOf(proto) !== null)
    proto = Object.getPrototypeOf(proto)

  return Object.getPrototypeOf(value) === proto
}

function hasKey(obj: Object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key)
}

function LinearToTree(linear: NodeItem[]): TreeNode[] | never {
  if (!Array.isArray(linear))
    throw new TypeError('[LinearToTree]: The input data should be an array.')

  const roots: TreeNode[] = []
  const innerLinear = linear.slice()
  const linearMap: Map<number, TreeNode> = new Map()

  for (let i = 0; i < innerLinear.length; i += 1) {
    const element = innerLinear[i]

    // check element
    if (!isPlainObject(element))
      throw new TypeError('[LinearToTree]: The data element should be an object.')

    // check 'id'
    if (!hasKey(element, 'id') || typeof element.id !== 'number')
      throw new TypeError('[LinearToTree]: The data element should have a key value called \'id\' and its value should be of type Number.')
    if (linearMap.has(element.id))
      throw new Error('[LinearToTree]: There are elements with the same \'id\', This is not allowed.')

    // check 'name'
    if (!hasKey(element, 'name') || typeof element.name !== 'string')
      throw new TypeError('[LinearToTree]: The data element should have a key value called \'name\' and its value should be of type String.')

    const treeNode = Object.assign({}, element, { children: [] })

    if (hasKey(element, 'parentId')) {
      // check 'parentId'
      if (typeof element.parentId !== 'number')
        throw new TypeError('[LinearToTree]: The \'parentId\' of the data element should be of type Number.')

      if (linearMap.has(element.parentId!)) {
        linearMap.get(element.parentId!)!.children.push(treeNode)
        innerLinear.splice(i, 1)
        i -= 1
      }
    }
    else {
      roots.push(treeNode)
      innerLinear.splice(i, 1)
      i -= 1
    }

    linearMap.set(element.id, treeNode)
  }

  for (let i = 0; i < innerLinear.length; i++) {
    const element = innerLinear[i]
    if (element?.parentId && linearMap.has(element.parentId))
      linearMap.get(element.parentId)!.children.push(linearMap.get(element.id)!)
  }
  return roots
}

export default LinearToTree
