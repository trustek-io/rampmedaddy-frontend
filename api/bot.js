import { Telegraf, session } from 'telegraf'

const TOKEN = process.env.REACT_APP_TOKEN
const INVITE_CODE = 'RMD2024!'
const web_link = process.env.REACT_APP_WEB_LINK

const bot = new Telegraf(TOKEN)

bot.use(
  session({
    defaultSession: () => ({ step: 'none' }),
  })
)

bot.start((ctx) => {
  ctx.session = { step: 'awaiting_code' }
  ctx.reply(`Hey there!
I'm RampMeDaddy bot and I can help you on-ramp crypto in a few simple steps.
To get started, please enter your invite code.`)
})

bot.hears(INVITE_CODE, (ctx) => {
  console.log(web_link)
  if (ctx.session.step === 'awaiting_code') {
    console.log('>>>ctx.session.step', ctx.session.step)
    ctx.session.step = 'code_correct'
    ctx.reply('Welcome!', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Launch',
              web_app: {
                url: 'https://rampmedaddy-frontend-rust.vercel.app/',
              },
            },
          ],
        ],
      },
    })
  }
})

bot.hears(/.*/, (ctx) => {
  if (
    ctx.session.step === 'awaiting_code' &&
    ctx.message.text !== INVITE_CODE
  ) {
    ctx.reply(
      'Sorry, this code is invalid. Please enter the correct invite code.'
    )
  }
})

bot.launch()
