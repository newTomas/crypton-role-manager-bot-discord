import {ExecuteEvent} from '../types'

const event: ExecuteEvent = {
  name: 'shardError',
  once: false,
  execute: (error: Error) => {
    console.error('A websocket connection encountered an error:', error)
    return true
  }
}

export default event
