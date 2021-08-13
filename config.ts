import dotenv from 'dotenv'
import path from 'path'
dotenv.config()

export default {
    TOKEN: process.env['TOKEN_DISCORD_BOT'] || '',
    PATH_TO_ROOT_DIR: path.parse(__dirname).dir,
    MINUTES_INTERVAL_CHECK_MEMBERS: Number(process.env['MINUTES_INTERVAL_CHECK_MEMBERS']) || 15
}
