const { Telegraf } = require('telegraf')
const Markup = require('telegraf/markup')

const TOKEN = '7451011598:AAFyv8V41N2weCc_JsfspChpTd4AsguoKds'
const bot = new Telegraf(TOKEN)

// const web_link = 'https://roaring-crumble-7ea203.netlify.app/'
const web_link = 'https://rampmedaddy-frontend-rust.vercel.app/'

const buttonMenu = Markup.inlineKeyboard([
  Markup.button.url('Launch', web_link),
])

bot.start(async (ctx) => {
  console.log('START')
  await ctx.reply('Welcome! Click the button to start.', buttonMenu)
})

bot.action('start_popup', (ctx) => {
  ctx.answerCbQuery('Starting...')
  ctx.reply('Popup message: Are you sure you want to start?')
})

bot.launch()
