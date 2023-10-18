# AI Chatbot Assistant for Zoom

This is a sample chatbot app using Node.js and ChatGPT API
> Free, open source chatbot personal assistant with customizable scripts.



<img width="1727" alt="image" src="https://user-images.githubusercontent.com/12186221/226397602-a210ac71-0628-479c-83e8-bfc35542cfa5.png">


## Screenshots：
- talk with your bot:
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
sync to notion database:
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



## Local/Development Setup

To run the completed chatbot locally, follow these steps:

1. Clone the repository and navigate to its directory in terminal: 

```
$ git@github.com:shixin-guo/my-bot.git
$ cd my-bot
$ pnpm install
$ cd ./package/api-server && touch .env
```

2. Add your respective [**development** Zoom Chatbot API credentials](https://marketplace.zoom.us/docs/guides/getting-started/app-types/create-chatbot-app#register) to the `.env` file:

```
zoom_bot_jid=*****@xmpp.zoom.us (Required)
zoom_client_id=***********(Required) 
zoom_client_secret=*********** (Required) 
zoom_verification_token=*********** (Required)
OPENAI_API_KEY=*************** (Required)
```

3. In terminal, run:
```
$ pnpm run dev
$ ngrok http 4000
```
(ngrok turns localhost into a live server so that slash commands and user actions can be sent to your app)

4. Open your ngrok https URL in a browser. You should see:
```
Welcome to Zoom! I'm ChatGPT, your virtual assistant. I'm here to help make your Zoom experience more enjoyable and efficient. How can I be of assistance?
```

5. On your App Marketplace Dashboard, add your ngrok https URL to your Whitelist URLs (App Credentials Page), **Development** Redirect URL for OAuth (App Credentials Page), and **Development** Bot Endpoint URL (Features Page). Make sure to match the path after your ngrok https URL with the express routes in `index.js`.

6. After that, your app is ready to be installed!
On your App Marketplace Dashboard, go to the **Local Test** page and click **Install**. After you click the **Authorize** button, you should be taken to your redirect URL and see this:

```
Thanks for installing the Chatbot for Zoom!
```

7. Now that your chatbot is installed on your Zoom account, go to a Zoom chat channel and type:

```
/ccbot
```


## Production Setup

To run the completed chatbot on a live server, follow these steps:

1. Fill in your [**production** Zoom Chatbot API credentials](https://marketplace.zoom.us/docs/guides/getting-started/app-types/create-chatbot-app#register) and your [Unsplash Access Key](https://unsplash.com/oauth/applications) in the **Config Vars** section.

2. Click **Deploy app**.

3. On your App Marketplace Dashboard, add your Heroku URL to your Whitelist URLs (App Credentials Page), **Production** Redirect URL for OAuth (App Credentials Page), and **Production** Bot Endpoint URL (Features Page). Make sure to match the path after your Heroku URL with the express routes in `index.js`.

4. On your App Marketplace Dashboard, go to the **Submit** page and click **Add to Zoom**. After you click the **Authorize** button, you should be taken to your redirect URL and see this:

```
Thanks for installing the Unsplash Chatbot for Zoom!
```

5. Now that your chatbot is installed on your Zoom account, go to a Zoom chat channel and type:

```
/shixin mountains
```

## Need Help?

If you have any questions, please reach out to me at [gzpoffline@gmail.com].

## Usage:

## Reference:

https://github.com/RainEggplant/chatgpt-telegram-bot

https://github.com/yagop/node-telegram-bot-api

https://github.com/FranP-code/Open-Telegram-to-Notion-Bot

https://github.com/Hayden-MP/Notion-database

https://medium.com/zoom-developer-blog/how-to-build-a-zoom-chatbot-c668b7361adb

## License
MIT
