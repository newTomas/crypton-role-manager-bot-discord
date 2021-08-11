import {readdirSync} from 'fs'
import {ExecuteEvent} from './types'

export async function loadEventsFromFiles(pathToEventsDirectory: string): Promise<ExecuteEvent[]> {
  const events: ExecuteEvent[] = []
  const eventFiles = readdirSync(pathToEventsDirectory)
  for (const file of eventFiles) {
    const fileEvent = await import(`${pathToEventsDirectory}/${file}`) as {default: ExecuteEvent}
    const event = fileEvent.default
    events.push(event)
  }
  return events
}
