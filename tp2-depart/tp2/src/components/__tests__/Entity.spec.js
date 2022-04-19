import { shallowMount } from '@vue/test-utils'
import Entity from '@/components/Entity'
import { ui } from '@/externalization/uiTextPlugin.js'

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
    expect(wrapper.find('#name').element.innerHTML).toBe(entity.name)
    expect(wrapper.find('#xp').element.innerHTML).toBe('Expérience: ' + ui.Entity.NAME1)
    expect(wrapper.find('#cg').element.innerHTML).toBe('Crédit: ' + entity.credit)
    expect(wrapper.find('#ship').element.innerHTML).toBe('Vaisseau: ' + entity.ship.name)
    expect(wrapper.find('#hp').element.innerHTML).toBe(hp + '%')
    // test pour que le progress bar update avec la bonne valeur
    expect(getComputedStyle(wrapper.find('#hp').element).getPropertyValue('width')).toBe(hp + '%')
  })
})
