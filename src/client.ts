export const exec = async (cmd: string): Promise<string> => {
  const url = location.origin + '/api/exec';
  const body = JSON.stringify({ cmd })
  const headers = { 'Content-Type': 'application/json' };
  return fetch(url, { method: 'POST', body, headers })
    .then(res => {
      if (res.ok) {
        return res.text()
      }
      throw new Error(res.statusText)
    })
}

const sortByIncludes = (value: string) => (a: Cvar, b: Cvar) => (a.name.includes(value) ? 1 : 0) - (b.name.includes(value) ? 1 : 0)
const sortByStartsWith = (value: string) => (a: Cvar, b: Cvar) => (a.name.startsWith(value) ? 1 : 0) - (b.name.startsWith(value) ? 1 : 0)

const mapToCvar = (indexes: number[]) => (cv: string) => ({
  name: cv.substring(indexes[0], indexes[1]).trim(),
  value: cv.substring(indexes[1], indexes[2]).trim(),
  defaultValue: cv.substring(indexes[2], indexes[3]).trim(),
  flags: cv.substring(indexes[3], indexes[4]).trim(),
  description: cv.substring(indexes[4]).trim(),
})

const mapCvarResponse = (value: string) => (res: string) => {
  const list = res?.split('\n') || []
      
  if (list.length < 3) {
    return []
  }

  const matches = list[1].trim().matchAll(/(_+)/g)
  const indexes = [...matches].map((m) => m.index || 0)

  if (indexes.length < 5) {
    return []
  }

  return list.splice(2)
    .map(mapToCvar(indexes))
    .reverse()
    .filter(({ name }) => name !== '')
    .sort(sortByIncludes(value))
    .sort(sortByStartsWith(value))
}

export const findCvar = async (q: string): Promise<Cvar[]> => {
  return exec(`find ${q}`)
    .then(mapCvarResponse(q))
}
