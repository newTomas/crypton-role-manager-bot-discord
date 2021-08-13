export function sleep(milliseconds: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, milliseconds))
}

type AnyObject = {[key: string]: any}

export function isDifferentObjects(objectOne: AnyObject, objectTwo: AnyObject): boolean {
  if (Object.keys(objectOne).length !== Object.keys(objectTwo).length) return true
  for (const keyOne of Object.keys(objectOne)) {
    if (objectOne[keyOne] !== objectTwo[keyOne]) return true
  }
  return false
}

export function isDifferentArrayObjects(arrayOne: AnyObject[], arrayTwo: AnyObject[]): boolean {
  if (arrayOne.length !== arrayTwo.length) return true
  for (let i = 0; i < arrayOne.length; i++) {
    if (isDifferentObjects(arrayOne[i], arrayTwo[i])) return true
  }
  return false
}
