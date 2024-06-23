const { Telegraf } = require('telegraf')
// import Telegraf from 'telegraf'

const TOKEN = '7451011598:AAFyv8V41N2weCc_JsfspChpTd4AsguoKds'
const bot = new Telegraf(TOKEN)

// const web_link = 'https://roaring-crumble-7ea203.netlify.app/'
const web_link = 'https://rampmedaddy-frontend-rust.vercel.app/'

bot.start((ctx) =>
  ctx.reply('Welcome', {
    reply_markup: {
      keyboard: [[{ text: 'RampMeDaddy', web_app: { url: web_link } }]],
    },
  })
)

bot.launch()
