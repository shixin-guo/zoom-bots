# my-bot

## Demo：
<img width="500" alt="image" src="https://user-images.githubusercontent.com/12186221/226104385-2e6b3c59-c6a3-40b9-9d31-d78abb7844c6.png">

<img width="500" alt="image" src="https://user-images.githubusercontent.com/12186221/226105014-422157b4-f12a-4312-a163-1aaae959783b.png">

## Technology Stack
- Server: Typescript + Express + Notion API + OpenAI API
- Deployment: Github Actions + Fly.io + Vercel
- UI: React + Next.js + Tailwindcss
- Cron: mergent
## Todo:

#### work and read:
- [x] openAI API integration
- [X] todo list
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
- [x] weather daily alert
- [ ] stock and crypto price alert
- [ ] drink water reminder 
- [ ] sedentary reminder

#### develepment exprience improvement
- [ ] git commit integration with https://github.com/zurawiki/gptcommit
- [ ] integrate with [hubot](https://hubot.github.com/)
- [ ] auto check readme and find and optimize grammar errors


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
<img width="837" alt="image" src="https://user-images.githubusercontent.com/12186221/226102693-58aac075-f4eb-49bd-9851-7c5f8c5b7837.png">

## Usage:

## Reference:

https://github.com/RainEggplant/chatgpt-telegram-bot

https://github.com/yagop/node-telegram-bot-api

https://github.com/FranP-code/Open-Telegram-to-Notion-Bot

https://github.com/Hayden-MP/Notion-database

https://medium.com/zoom-developer-blog/how-to-build-a-zoom-chatbot-c668b7361adb

## License
MIT
