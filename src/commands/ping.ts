import {CommandInteraction} from 'discord.js'
import {ExecuteCommand} from '../types'

const command: ExecuteCommand = {
  name: 'ping',
  description: 'Replies with Pong!',
  execute: async (interaction: CommandInteraction): Promise<void> => {
    await interaction.reply('Pong!')
  }
}

export default command
