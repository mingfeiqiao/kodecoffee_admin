import emojiRegex from "emoji-regex";

export const encodeEmoji = str => {
  const regex = emojiRegex()
  return str.replace(regex, p => `emoji(${p.codePointAt(0)})`)
}

export const decodeEmoji = str => {
  const emojiDecodeRegex = /emoji\(\d+\)/g
  return str.replace(emojiDecodeRegex, p => {
    const filterP = p.replace(/[^\d]/g, '')
    return String.fromCodePoint(filterP)
  })
}

export const encodeEmojiObjByKeys = (obj, keys) => {
  if(!keys || keys.length === 0) return obj
  for(let key in keys) {
    if(obj[key]) {
      obj[key] = encodeEmoji(obj[key])
    }
  }
  return obj
}

export const decodeEmojiObjByKeys = (obj, keys) => {
  if(!keys || keys.length === 0) return obj
  for(let key of keys) {
    if(obj[key]) {
      obj[key] = decodeEmoji(obj[key])
    }
  }
  return obj
}