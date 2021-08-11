import dotenv from 'dotenv'
dotenv.config()

export default {
    TOKEN: process.env['TOKEN_DISCORD_BOT'] as string
}
