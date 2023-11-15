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

export const getCvarList = async (): Promise<string[]> => {
  const re = /^((sv_|mp_|log_|status|find|kick|help)[a-z_]*)/gm;
  return exec('cvarlist')
    .then(list => [...list.matchAll(re)].map(c => c[1].trim()))
}

export const findCvar = async (q: string): Promise<Cvar[]> => {
  return exec(`find ${q}`)
    .then(res => {
      // TODO: cleanup

      const list = res?.split('\n') || []
      
      if (list.length < 3) {
        return []
      }

      const matches = list[1].trim().matchAll(/(_+)/g)
      const indexes = [...matches].map((m) => m.index || 0)

      if (indexes.length < 5) {
        return []
      }

      const data = list.splice(2)

      return data.map((cv) => ({
        name: cv.substring(indexes[0], indexes[1]).trim(),
        value: cv.substring(indexes[1], indexes[2]).trim(),
        defaultValue: cv.substring(indexes[2], indexes[3]).trim(),
        flags: cv.substring(indexes[3], indexes[4]).trim(),
        description: cv.substring(indexes[4]).trim(),
      })).filter(({ name }) => name !== '');
    })
}
