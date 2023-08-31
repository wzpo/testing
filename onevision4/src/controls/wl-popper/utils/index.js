
export const generateId = ((index = 0) => () => (index++).toString())()

export const createDivInBody = () => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  return div
}
