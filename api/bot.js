import { Telegraf } from 'telegraf'

const TOKEN = process.env.REACT_APP_TOKEN
const bot = new Telegraf(TOKEN)

const web_link = process.env.REACT_APP_WEB_LINK

bot.start((ctx) =>
  ctx.reply('Welcome to RampMeDaddy!', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Launch', web_app: { url: web_link } }]],
    },
  })
)

bot.launch()
