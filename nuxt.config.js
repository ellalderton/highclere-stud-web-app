const pkg = require('./package')
const bodyParser = require('body-parser')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'Highclere Stud',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
      { hid: 'description', name: 'description', content: 'Highclere Stud app' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:site', content: '@' },
      { name: 'twitter:title', content: 'Highclere Stud' },
      { name: 'twitter:description', content: 'Highclere Stud app' },
      // { name: 'twitter:image', content: 'https://nuxt-ssr-test.herokuapp.com/icon.png' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: '#48ACDA',
    height: '6px'
  },
  // loading: false,

  /*
  ** Global CSS
  */
  css: [
    '@/assets/sass/app.scss'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/core-components.js',
    '~plugins/filters.js',
    { src: '~/plugins/hammer.js', ssr: false },
    { src: '~/plugins/bugsnag.js', ssr: false },
    { src: '~/plugins/datepicker.js', ssr: false },
    '~plugins/global-mixins.js'
  ],

  manifest: {
    name: 'Highclere Stud',
    short_name: 'Highclere Stud',
    display: 'standalone',
    background_color: "#48ACDA",
    theme_color: "#48ACDA",
    start_url: "/"
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/google-analytics',
    'vue-sweetalert2/nuxt',
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    progress: false
  },

  /*
  ** Build configuration
  */
  build: {
    vendor: ['hammerjs'],
    vendor: ['vue-zoom'],
    cssSourceMap: false, // to stop asyncData causing bootstrap.css.map requests, known nuxt error.
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      const svgRule = config.module.rules.find(rule => rule.test.test('.svg'));

      svgRule.test = /\.(png|jpe?g|gif|webp)$/;

      config.module.rules.push({
        test: /\.svg$/,
        loader: 'vue-svg-loader',
      });
    }
  },

  router: {
    middleware: ['refresh-horses', 'set-previous-page', 'show-welcome'],
  },

  /*
  ** Analytics configuration
  */
  'google-analytics': {
    id: 'UA-27808947-2'
  },

  workbox: {
    offlinePage: '/offline'
  },

  serverMiddleware: [
    // bodyParser.json({limit: '50mb'}),
  ]
}
