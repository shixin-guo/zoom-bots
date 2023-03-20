# my-bot
> Free, open source chatbot personal assistant with customizable scripts.

## Screenshots：
- talk to bot:
 <img width="600" alt="image" src="https://user-images.githubusercontent.com/12186221/226391961-b3e17cb4-1bd0-4beb-8e1d-9fbed10a4699.png">
 
- use chatbot when you talking with friends:
 <img width="600" alt="image" src="https://user-images.githubusercontent.com/12186221/226392413-932462af-a019-4a40-94ac-266272dd7336.png">



## Technology Stack
- Server: Typescript + Express + Notion API + OpenAI API
- Deployment: Github Actions + Fly.io + Vercel
- UI: React + Next.js + Tailwindcss
- Cron: mergent
## Todo:

#### work and read:
- [x] openAI API integration
- [X] todo list 
<img width="620" alt="image" src="https://user-images.githubusercontent.com/12186221/226394985-f65c3996-f012-49c6-995d-26a8c6e25a7a.png">
<img width="620" alt="image" src="https://user-images.githubusercontent.com/12186221/226395281-94128448-664c-4333-9622-0212664d69ee.png">

- [x] [Zoom chat] integration
- [ ] RSS feed
- [x] support save to notion 
- [x] webhooks
- [ ] generate weekly report read list
- [ ] telegram bot integration
- [ ] midjourney integration
- [ ] sync twitter favorite to notion
- [ ] read article and generate summary and save to notion

#### health:
- [x] support cron job  
<img width="1249" alt="image" src="https://user-images.githubusercontent.com/12186221/226394527-b1a5faef-5249-4a68-afed-7eed30c442e6.png">

- [x] weather daily alert 
<img width="600" alt="image" src="https://user-images.githubusercontent.com/12186221/226392692-416383f6-4118-4631-8616-23e919b64127.png">


- [ ] stock and crypto price alert
- [ ] drink water reminder 
- [ ] sedentary reminder

#### develepment exprience improvement
- [ ] git commit integration with https://github.com/zurawiki/gptcommit
- [ ] integrate with [hubot](https://hubot.github.com/)
- [ ] auto check readme and find and optimize grammar errors
- [ ] support replay and context

## Installation:

- sign up notion and openAI
- sign up vercel and fly.io
- config zoom apps in zoom marketplace

- input env variables in .env file ./packages/api-server:

```
zoom_client_id=*****
zoom_client_secret=*****
zoom_bot_jid=*****@xmpp.zoom.us
zoom_verification_token=*****

API_HUB_URL=https://api-hub.fly.dev/subscribe // prevent openAI api timeout 

OPENAI_API_KEY=*******

NOTION_API_KEY=*****
NOTION_DATABASE_ID=****

WEATHER_API_KEY=***** // http://api.openweathermap.org

```




```
pnpm i 

```

deploy to vercel and fly.io



## Config:
<img width="400" alt="image" src="https://user-images.githubusercontent.com/12186221/226102693-58aac075-f4eb-49bd-9851-7c5f8c5b7837.png">

## Usage:

## Reference:

https://github.com/RainEggplant/chatgpt-telegram-bot

https://github.com/yagop/node-telegram-bot-api

https://github.com/FranP-code/Open-Telegram-to-Notion-Bot

https://github.com/Hayden-MP/Notion-database

https://medium.com/zoom-developer-blog/how-to-build-a-zoom-chatbot-c668b7361adb

## License
MIT
