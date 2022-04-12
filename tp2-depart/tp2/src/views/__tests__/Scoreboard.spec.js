import { shallowMount } from '@vue/test-utils'
import { rankingService } from '@/services/rankingService'
import Scoreboard from '@/views/Scoreboard.vue'
import { rankingJsonFake } from '@/../tests/data/rankingJsonFake'
import flushPromises from 'flush-promises'

jest.mock('@/services/rankingService')
let scores

beforeEach(() => {
  scores = [...rankingJsonFake]
  jest.clearAllMocks()
})
describe('Scoreboard.vue', () => {
  test('Par défaut, doit afficher les scores avec les noms', async () => {
    rankingService.getRanking.mockResolvedValue(scores)
    const wrapper = shallowMount(Scoreboard)
    await flushPromises()
    const tdValue = wrapper
    .findAll('td')
    .wrappers.map(td => td.element.value)
    expect(tdValue).toContainEqual(scores.name)
    expect(tdValue).toContainEqual(scores.score)
  })
  test('Par défaut, si il y a une erreur serveur, affiche une notification', async () => {
    rankingService.getRanking.mockImplementation(() => {
      throw new Error();
    })
    const makeToast = jest.fn()
    const mock = {$bvToast: {
      toast: () => makeToast()
    }}
    const wrapper = shallowMount(Scoreboard, {
      mocks: mock
    })
    await flushPromises()
    expect(makeToast).toHaveBeenCalled()
  })
})