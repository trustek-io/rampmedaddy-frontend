import { Telegraf } from 'telegraf'

const TOKEN = '7451011598:AAFyv8V41N2weCc_JsfspChpTd4AsguoKds'
const bot = new Telegraf(TOKEN)

const web_link = 'https://rampmedaddy-frontend-rust.vercel.app/'

bot.start((ctx) =>
  ctx.reply('Welcome to RampMeDaddy!', {
    reply_markup: {
      inline_keyboard: [[{ text: 'Launch', web_app: { url: web_link } }]],
    },
  })
)

bot.launch()
