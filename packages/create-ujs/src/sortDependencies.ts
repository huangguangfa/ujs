/**
 * 排序依赖项
 * @param  packageJson packageJson内容
 */
export function sortDependencies(packageJson) {
  const sorted = {}
  const depTypes = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
  ]
  for (const depType of depTypes) {
    const depContent = packageJson[depType]
    if (depContent) {
      sorted[depType] = {}

      Object.keys(depContent)
        .sort()
        .forEach((name) => {
          sorted[depType][name] = depContent[name]
        })
    }
  }

  return {
    ...packageJson,
    ...sorted,
  }
}
