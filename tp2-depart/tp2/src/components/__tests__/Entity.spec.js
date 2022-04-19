import { shallowMount } from '@vue/test-utils'
import Entity from '@/components/Entity'

describe('Entity.vue', () => {
  test('Doit afficher les infos qui provient du composant parent', async () => {
    const entity = {
      name: 'TestName',
      credit: 50,
      experience: 1,
      ship: {
        name: 'TestShip'
      }
    }
    const hp = 50
    const wrapper = shallowMount(Entity)
    await wrapper.setProps({ info: entity, health: hp })
  })
})
