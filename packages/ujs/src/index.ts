console.log('ujs')

export interface Ujs {
  name: string
}

export function ujs(config: Ujs) {
  return config.name
}
