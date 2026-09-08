// @ts-check
// TODO View .env
import { defineConfig, passthroughImageService } from 'astro/config';
import { loadEnv } from "vite";

import { storyblok } from '@storyblok/astro';
import vercel from '@astrojs/vercel';

import sitemap from '@astrojs/sitemap';
import favicons from 'astro-favicons'; //TODO Change favicon.svg in public/


import tailwindcss from "@tailwindcss/vite";


const env = loadEnv('', process.cwd(), '');
const storyblokAccessToken = env.STORYBLOK_DELIVERY_API_TOKEN || env.STORYBLOK_TOKEN || '';
const storyblokSpaceId = env.STORYBLOK_SPACE_ID || 'your_space_id';
const storyblokIntegration = storyblokAccessToken
  ? [storyblok({
      accessToken: storyblokAccessToken,
      apiOptions: {
        region: 'eu',
      },
      components: {
        page: "components/storyblok/Page"
      },
      enableFallbackComponent: true,
      customFallbackComponent: "components/storyblok/Fallback",
      bridge: true,
    })]
  : [];

// https://astro.build/config
export default defineConfig({
  //TODO Change url
  site: 'https://www.exemple.fr',

  output: env.IS_PREVIEW ? "server" : "static",

  integrations: [...storyblokIntegration, sitemap(), favicons()],

  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
    imagesConfig: {
      minimumCacheTTL: 86400,
      sizes: [300, 720, 1080, 1560, 1920, 2560],
      remotePatterns: [
        {
          protocol: "https",
          hostname: "a.storyblok.com",
          pathname: `/f/${storyblokSpaceId}/**`,
        },
      ],
    },
  }),

  image: {
    service: passthroughImageService(),
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
        pathname: `/f/${storyblokSpaceId}/**`,
      },
    ],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});