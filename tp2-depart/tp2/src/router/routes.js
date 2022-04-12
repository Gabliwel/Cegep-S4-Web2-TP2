import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import Scoreboard from '../views/Scoreboard.vue'
import PageNotFound from '../views/PageNotFound.vue'

export default [
  {
    path: '/',
    name: 'Root',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/game',
    name: 'Game',
    component: Game
  },
  {
    path: '/scoreboard',
    name: 'Scoreboard',
    component: Scoreboard
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound
  }
]
