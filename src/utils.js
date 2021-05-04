export function delay(value, ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value)
    }, ms)
  })
}
