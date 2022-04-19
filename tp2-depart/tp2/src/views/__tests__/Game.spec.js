import { shallowMount } from '@vue/test-utils'
import { charactersService } from '@/services/charactersService'
import Game from '@/views/Game.vue'
import { charactersJsonFake } from '@/../tests/data/charactersJsonFake'
import flushPromises from 'flush-promises'

jest.mock('@/services/charactersService')
let characters

beforeEach(() => {
  characters = [...charactersJsonFake]
  jest.clearAllMocks()
})
describe('Game.vue', () => {
  test('', async () => {
  })
})