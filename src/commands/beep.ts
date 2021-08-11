import {CommandInteraction} from 'discord.js'
import {ExecuteCommand} from '../types'

const command: ExecuteCommand = {
  name: 'beep',
  description: 'Replies with Boop!',
  execute: async (interaction: CommandInteraction): Promise<void> => {
    await interaction.reply('Boop!')
  }
}

export default command
