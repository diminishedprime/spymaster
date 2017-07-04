const fgColorForRGB = ({red, green, blue}) =>
  (red*0.299 + green*0.587 + blue*0.114) > 186 ? '#000000' : '#ffffff'

const hexToRGB = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return {
    red: parseInt(result[1], 16),
    green: parseInt(result[2], 16),
    blue: parseInt(result[3], 16),
  }
}

export const fgForHex = (hex) => fgColorForRGB(hexToRGB(hex))
