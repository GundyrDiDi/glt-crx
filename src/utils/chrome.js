export const sendMessage = (cmd, data) => {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ cmd, data }, resolve)
  })
}

export default {
  sendMessage
}
