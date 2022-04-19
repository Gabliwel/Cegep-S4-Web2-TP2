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
  test('Si le champ nom est vide, affiche une notification lors du changement de page.', async () => {
    shipsService.getShips.mockResolvedValue(ships)
    const makeToast = jest.fn()
    const mock = {$bvToast: {
      toast: () => makeToast()
    }}
    const wrapper = shallowMount(Home, {
      mocks: mock
    })
    await flushPromises()
    const options = wrapper.find('select').findAll('option')
    await options.at(1).setSelected()
    await wrapper.find('button').trigger('click')
    expect(makeToast).toHaveBeenCalled()
  })
  test("Si le vaisseau n'est pas choisi, affiche une notification lors du changement de page.", async () => {
    shipsService.getShips.mockResolvedValue(ships)
    const makeToast = jest.fn()
    const mock = {$bvToast: {
      toast: () => makeToast()
    }}
    const wrapper = shallowMount(Home, {
      mocks: mock
    })
    await flushPromises()
    wrapper.find('input').setValue('Bob')
    await wrapper.find('button').trigger('click')
    expect(makeToast).toHaveBeenCalled()
  })
  test('Si le vaisseau et le nom est choisi, redirige vers la page Game avec les informations', async () => {
    shipsService.getShips.mockResolvedValue(ships)
    const pushToGame = jest.fn()
    const mock = {$router: {
      push: param => pushToGame(param)
    }}
    const wrapper = shallowMount(Home, {
      mocks: mock
    })
    await flushPromises()
    wrapper.find('input').setValue('Bob')
    const options = wrapper.find('select').findAll('option')
    await options.at(1).setSelected()
    const selected = options.at(1).element.value
    await wrapper.find('button').trigger('click')
    expect(pushToGame).toBeCalledWith({ name: 'Game', params: { name: 'Bob', ship: selected } })
  })
})