export const exec = async (cmd: string): Promise<string> => {
  const url = location.origin + '/api/exec';
  const body = JSON.stringify({ cmd })
  const headers = { 'Content-Type': 'application/json' };
  return fetch(url, { method: 'POST', body, headers })
    .then(res => res.text())
}

export const getCvarList = async (): Promise<string[]> => {
  const re = /^((sv_|mp_|log_|status|find|kick|help)[a-z_]*)/gm;
  return exec('cvarlist')
    .then(list => [...list.matchAll(re)].map(c => c[1].trim()))
}