import solid from 'vite-plugin-solid'
import ssr from 'vite-plugin-ssr/plugin'

export default {
  plugins: [solid({ ssr: true }), ssr({ prerender: true })]
}
