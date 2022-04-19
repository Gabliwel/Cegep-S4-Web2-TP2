import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import NavigationBar from '@/components/NavigationBar.vue'

describe('NavigationBar.vue', () => {
  test('Doit contenir un lien sur la page Home.', async () => {
    const wrapper = shallowMount(NavigationBar, {
      stubs: {
        RouterLink: RouterLinkStub
      }
    })
    const routerLinks = wrapper
      .findAllComponents(RouterLinkStub)
      .wrappers.map(routerLink => routerLink.props().to)

    expect(routerLinks).toContainEqual({
      name: 'Home'
    })
  })
  test('Doit contenir un lien sur la page Scoreboard.', async () => {
    const wrapper = shallowMount(NavigationBar, {
      stubs: {
        RouterLink: RouterLinkStub
      }
    })
    const routerLinks = wrapper
      .findAllComponents(RouterLinkStub)
      .wrappers.map(routerLink => routerLink.props().to)

    expect(routerLinks).toContainEqual({
      name: 'Scoreboard'
    })
  })
})
