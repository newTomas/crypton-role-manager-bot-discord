import {assert} from 'chai'

export async function shouldThrowFunction(func: () => any, message?: string): Promise<void> {
  try {
    await func()
    assert(true)
  } catch (err) {return}
  assert(false, message ?? 'Функция не выдала ошибку.')
}
