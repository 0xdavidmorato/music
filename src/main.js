import App from './App.svelte'
// include the psychedelic theme css so it's available for toggle
import '/assets/psychedelic_night.css'

const app = new App({
  target: document.getElementById('app')
})

export default app
