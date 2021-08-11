import {ExecuteEvent} from '../types'
import {EventNames} from '../enums'

const event: ExecuteEvent = {
  name: EventNames.ready,
  once: true,
  execute: () => {
    console.info('Bot is ready!')
  }
}

export default event
