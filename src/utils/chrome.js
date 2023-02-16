export const sendMessage = (cmd, data) => {
  const p = new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ cmd, data }, (res) => {
      if (res?.error === 'background error') {
        console.error(res)
        reject(res)
      } else {
        resolve(res)
      }
    })
  })
  return p
}

export default {
  sendMessage
}
