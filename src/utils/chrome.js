export const sendMessage = (cmd, data) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ cmd, data }, (res) => {
      if (res?.error === 'background error') {
        console.error(res)
        reject(res)
      } else {
        resolve(res)
      }
    })
  })
}

export default {
  sendMessage
}
