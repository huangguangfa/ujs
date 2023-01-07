export const arrowCallback = (s: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let a = s ?? '1'
      resolve(111 + a)
    }, 2000)
  })
}

console.log('111')
