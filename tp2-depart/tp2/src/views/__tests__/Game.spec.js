import { shallowMount } from '@vue/test-utils'
import { charactersService } from '@/services/charactersService'
import Game from '@/views/Game.vue'
import { charactersJsonFake } from '@/../tests/data/charactersJsonFake'
import flushPromises from 'flush-promises'

jest.mock('@/services/charactersService')
let characters

const ANY_NAME = 'ALLO'
const ANY_SHIP = 'BONSOIR'

beforeEach(() => {
  characters = [...charactersJsonFake]
  jest.clearAllMocks()
})
describe('Game.vue', () => {
  test('Par défaut, le Player et Enemy de Game commence avec les bonnes informations', async () => {
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
    const wrapper = await basicGameShallowMount()
    // player
    expect(wrapper.vm.player.name).toBe(ANY_NAME)
    expect(wrapper.vm.player.credit).toBe(0)
    expect(wrapper.vm.player.experience).toBe(4)
    expect(wrapper.vm.player.ship.name).toBe(ANY_SHIP)
    // enemy
    expect(wrapper.vm.enemy.name).toBe(characters[1].name)
    expect(wrapper.vm.enemy.credit).toBe(characters[1].credit)
    expect(wrapper.vm.enemy.experience).toBe(characters[1].experience)
    expect(wrapper.vm.enemy.ship.name).toBe(characters[1].ship.name)
  }),
  test('Par défaut, si il y a une erreur serveur, affiche un message et redirige vers Home', async () => {
    charactersService.getNbCharacters.mockResolvedValue(10)
    const wrapper = await basicGameShallowMount()
  })
})

async function basicGameShallowMount() {
  const wrapper = shallowMount(Game, {
    mocks: {
      $route: {
        params: {
          name: ANY_NAME,
            ship: ANY_SHIP
          }
        }
      }
    }
  )
  await flushPromises()
  return wrapper
}
