// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  app: {
    baseURL: '/konverti/' // baseURL: '/<repository>/'
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-icon',
    '@samk-dev/nuxt-vcalendar'
  ],
  extends: ["github:alexislopes/ProfileBadge#master"],
  pages: true,
  ssr: false,
});
