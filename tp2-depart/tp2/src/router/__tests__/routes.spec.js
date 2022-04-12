import { mount, createLocalVue } from '@vue/test-utils'
import App from '@/App.vue'
import VueRouter from 'vue-router'
import routes from '@/router/routes'
import Home from '@/views/Home.vue'
import Scoreboard from '@/views/Scoreboard.vue'
import Game from '@/views/Game.vue'
import PageNotFound from '@/views/PageNotFound'

const localVue = createLocalVue()
localVue.use(VueRouter)

jest.mock('@/views/Home.vue', () => ({
  render: () => ''
}))
jest.mock('@/views/Scoreboard.vue', () => ({
  render: () => ''
}))
jest.mock('@/views/Game.vue', () => ({
  render: () => ''
}))

let wrapper
let router

beforeEach(() => {
  router = new VueRouter({ routes, mode: 'abstract' })
  wrapper = mount(App, {
    localVue,
    router
  })
})

describe('routes.js', () => {
  test('/home doit afficher la page douverture.', async () => {
    await router.push('/home')
    
    expect(wrapper.findComponent(Home).exists()).toBe(true)
  })

  test('/ doit afficher la page douverture.', async () => {
    await router.push('/')
    
    expect(wrapper.findComponent(Home).exists()).toBe(true)
  })

  test('/scoreboard doit afficher la page des scores.', async () => {
    await router.push('/scoreboard')
    
    expect(wrapper.findComponent(Scoreboard).exists()).toBe(true)
  })

  test('/game doit afficher la page de jeu.', async () => {
    await router.push('/game')
    
    expect(wrapper.findComponent(Game).exists()).toBe(true)
  })

  test('/no-idea doit afficher la page not found.', async () => {
    await router.push('/no-idea')
    
    expect(wrapper.findComponent(PageNotFound).exists()).toBe(true)
  })
})
