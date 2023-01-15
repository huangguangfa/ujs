export const hasOwn = Object.prototype.hasOwnProperty
export const toString = Object.prototype.toString
export const isWindow = (item: object): boolean =>
  item && typeof item === 'object' && 'setInterval' in item

export const is = (type: string, primitive: boolean = false) => {
  return function (obj: any): boolean {
    return primitive
      ? typeof obj === type.toLowerCase()
      : toString.call(obj) === `[object ${type}]`
  }
}

export const match = (
  item: string | number,
  pattern: RegExp | string,
  flags?: string
): boolean => {
  const regex = new RegExp(pattern, flags)
  return regex.test(String(item))
}

/**
 * @method 检测当前类型是否是对象
 * @param item 检测当前类型
 * @returns { Boolean } 如果是对象则返回true、否则返回false
 */
export function isObject(item: any): boolean {
  return is('Object')(item)
}

/**
 * @method 检测当前类型是否是空对象
 * @param item 检测当前类型
 * @returns { Boolean } 如果为空的对象则返回true、否则返回false
 */
export function isEmptyObject(item: any): boolean {
  return isObject(item) && Object.keys(item as Object).length === 0
}

/**
 * @method 检测当前类型是否是数组
 * @param item 检测当前类型
 * @returns { Boolean } 如果是数组则返回true、否则返回false
 */
export function isArray(item: any): boolean {
  return Array.isArray(item) || is('Array')(item)
}

/**
 * @method 检测当前类型是否是空数组
 * @param item 检测当前类型
 * @returns { Boolean } 如果为空数组则返回true、否则返回false
 */
export function isEmptyArray(item: any): boolean {
  return isArray(item) && item.length === 0
}

/**
 * @method 检测当前类型是否为函数
 * @param item 检测当前类型
 * @returns { Boolean } 如果是函数则返回true、否则返回false
 */
export function isFunction(item: any): boolean {
  return is('Function')(item)
}

/**
 * @method 检测当前类型是否为空函数
 * @param item 检测当前类型
 * @returns { Boolean } 如果是空函数则返回true、否则返回false
 */
export function isEmptyFunction(item: any): boolean {
  if (!item) return true
  const str = item.toString().replace(/\s/g, '')
  return (
    isFunction(item) &&
    (str === 'functionEMPTY_FUNC(){}' ||
      str === 'function(){}' ||
      str === '()=>{}')
  )
}

/**
 * @method 检测当前类型是否为字符串
 * @param item 检测当前类型
 * @returns { Boolean } 如果是字符串则返回true、否则返回false
 */
export function isString(item: unknown): boolean {
  return is('String', true)(item)
}

/**
 * @method 检测当前类型是否为空字符串
 * @param item 检测当前类型
 * @returns { Boolean } 如果是空字符串则返回true、否则返回false
 */
export function isEmptyString(item: string): boolean {
  return is('String', true)(item) && item.trim().length === 0
}

/**
 * @method 检测当前类型是否为JSON字符串
 * @param item 检测当前类型
 * @returns { Boolean } 如果是JSON字符串则返回true、否则返回false
 */
export function isJsonString(item: string): boolean | any {
  try {
    if (typeof JSON.parse(item) === 'object') return true
  } catch {
    return false
  }
}

/**
 * @method 将当前的JSON转化为相应的对象
 * @param item 当前的JSON
 * @param defs 默认值
 * @returns {Object|Array} 如果当前数据可以转化成功则转化，否则将返回默认值
 */
export function json(item: string, defs: any) {
  try {
    return JSON.parse(item)
  } catch (e) {
    return defs
  }
}
