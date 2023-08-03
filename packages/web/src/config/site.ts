import { SiteConfig } from '@/types';
import { env } from '@/env.mjs';
const ProjectName = 'LingoAssist';
export const siteConfig: SiteConfig = {
  name: ProjectName,
  description: `${ProjectName} is a global multilingual support software that offers a simple and straightforward solution for language localization in your applications and websites. Regardless of the scale of your project, ${ProjectName} allows you to effortlessly achieve a multilingual interface, attracting a wider audience worldwide.`,
  url: env.NEXT_PUBLIC_APP_URL,
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
  links: {
    // todo
    twitter: 'https://twitter.com/gzponline',
    github: 'https://github.com/shixin-guo',
  },
};
