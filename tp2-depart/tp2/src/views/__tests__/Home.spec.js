import { shallowMount } from '@vue/test-utils'
import { shipsService } from '@/services/shipsService'
import Home from '@/views/Home.vue'
import { shipsJsonFake } from '@/../tests/data/shipsJsonFake'
import flushPromises from 'flush-promises'

jest.mock('@/services/shipsService')
let ships

beforeEach(() => {
  ships = [...shipsJsonFake]
  jest.clearAllMocks()
})
describe('Home.vue', () => {
  test('Par défaut, doit afficher les noms de vaisseaux', async () => {
    shipsService.getShips.mockResolvedValue(ships)
    const wrapper = shallowMount(Home)
    await flushPromises()
    const optionValue = wrapper
    .findAll('option')
    .wrappers.map(option => option.element.value)
    expect(optionValue).toContain(ships[0].name)
    expect(optionValue).toContain(ships[1].name)
    expect(optionValue).toContain(ships[2].name)
  })
  test('Par défaut, si il y a une erreur serveur, bloque le input, le select et le bouton', async () => {
    shipsService.getShips.mockImplementation(() => {
      throw new Error();
    })
    const makeToast = jest.fn()
    const mock = {$bvToast: {
      toast: () => makeToast()
    }}
    const wrapper = shallowMount(Home, {
      mocks: mock
    })
    await flushPromises()
    expect(wrapper.find('input').attributes().disabled).toBe('disabled')
    expect(wrapper.find('select').attributes().disabled).toBe('disabled')
    expect(wrapper.find('button').attributes().disabled).toBe('disabled')
  })
  test('Par défaut, si il y a une erreur serveur, affiche une notification', async () => {
    shipsService.getShips.mockImplementation(() => {
      throw new Error();
    })
    const makeToast = jest.fn()
    const mock = {$bvToast: {
      toast: () => makeToast()
    }}
    const wrapper = shallowMount(Home, {
      mocks: mock
    })
    await flushPromises()
    expect(makeToast).toHaveBeenCalled()
  })
})