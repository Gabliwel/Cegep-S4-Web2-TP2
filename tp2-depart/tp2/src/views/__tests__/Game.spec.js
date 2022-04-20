import { shallowMount } from '@vue/test-utils'
import { charactersService } from '@/services/charactersService'
import { rankingService } from '@/services/rankingService'
import Game from '@/views/Game.vue'
import { charactersJsonFake } from '@/../tests/data/charactersJsonFake'
import flushPromises from 'flush-promises'
import { ui } from '@/externalization/uiTextPlugin.js'

jest.mock('@/services/charactersService')
jest.mock('@/services/rankingService')
let characters

const ANY_NAME = 'ALLO'
const ANY_SHIP = 'BONSOIR'
const ANY_SCORE = 0

beforeEach(() => {
  characters = [...charactersJsonFake]
  jest.clearAllMocks()
  // jest.resetAllMocks()
})

describe('Game.vue', () => {
  test('Par défaut, si il y a aucun nom de joueur et/ou de vaisseau, retourne a Home', async () => {
    const pushToHome = jest.fn()
    //pas le choix du msgBoxConfirm a cause du select enemy qui se fait au created
    const msgBoxConfirm = jest.fn().mockResolvedValue(true)
    const mock = {
      $route: {
        params: {
          name: undefined,
          ship: undefined
        }
      },
      $router: {
        push: param => pushToHome(param)
      },
      $bvModal: {
        msgBoxOk: param => msgBoxConfirm(param)
      }
    }
    const wrapper = await customMockGameShallowMount(mock)
    expect(pushToHome).toBeCalledWith({ name: 'Home'})
  })
  test('Par défaut, si il y a une erreur serveur, affiche un message et redirige vers Home', async () => {
    const msgBoxConfirm = jest.fn().mockResolvedValue(true)
    const pushToHome = jest.fn()
    charactersService.getNbCharacters.mockResolvedValue(() => {
      throw new Error();
    })
    const mock = {
      $route: {
        params: {
          name: ANY_NAME,
          ship: ANY_SHIP
        }
      },
      $bvModal: {
        msgBoxOk: () => msgBoxConfirm()
      },
      $router: {
        push: param => pushToHome(param)
      }
    }
    const wrapper = await customMockGameShallowMount(mock)
    expect(msgBoxConfirm).toHaveBeenCalledTimes(1)
    expect(pushToHome).toBeCalledWith({ name: 'Home'})
  })
  test('Par défaut, le Player et Enemy de Game commence avec les bonnes informations', async () => {
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
    const wrapper = await basicGameShallowMount()
    // player
    expect(wrapper.vm.player.name).toBe(ANY_NAME)
    expect(wrapper.vm.player.credit).toBe(0)
    expect(wrapper.vm.player.experience).toBe(4)
    expect(wrapper.vm.player.ship.name).toBe(ANY_SHIP)
    expect(wrapper.vm.playerHealth).toBe(100)
    // enemy
    expect(wrapper.vm.enemy.name).toBe(characters[1].name)
    expect(wrapper.vm.enemy.credit).toBe(characters[1].credit)
    expect(wrapper.vm.enemy.experience).toBe(characters[1].experience)
    expect(wrapper.vm.enemy.ship.name).toBe(characters[1].ship.name)
    expect(wrapper.vm.enemyHealth).toBe(100)
    // global
    expect(wrapper.vm.nbFight).toBe(1)
    expect(wrapper.find('#nbFight').element.innerHTML).toBe('1/5')
  })
  test('Après 5 mission réussi, la partie est gagné et le score est sauveguardé', async () => {
    const msgBoxConfirm = jest.fn().mockResolvedValue(true)
    const pushToHome = jest.fn()
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
    rankingService.postRanking.mockResolvedValue({name: ANY_NAME, score: ANY_SCORE})
    const wrapper = await customMockGameShallowMount({
      $bvModal: {
        msgBoxOk: param => msgBoxConfirm(param)
      },
      $router: {
        push: param => pushToHome(param)
      },
      $route: {
        params: {
          name: ANY_NAME,
          ship: ANY_SHIP
        }
      }
    })
    await wrapper.setData({nbFight: 5})
    await wrapper.find('#end').trigger('click')
    await flushPromises()
    expect(msgBoxConfirm).toBeCalledWith(ui.Game.SCORE_SAVED)
    expect(pushToHome).toHaveBeenCalledWith({ name: 'Scoreboard'})
  })
  test('Après 5 mission réussi, la partie est gagné et le score est nest pas sauveguardé si il y a une erreur serveur', async () => {
    const msgBoxConfirm = jest.fn().mockResolvedValue(true)
    const pushToHome = jest.fn()
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
    rankingService.postRanking.mockImplementation(() => {
      throw new Error();
    })
    const wrapper = await customMockGameShallowMount({
      $bvModal: {
        msgBoxOk: param => msgBoxConfirm(param)
      },
      $router: {
        push: param => pushToHome(param)
      },
      $route: {
        params: {
          name: ANY_NAME,
          ship: ANY_SHIP
        }
      }
    })
    await wrapper.setData({nbFight: 5})
    await wrapper.find('#end').trigger('click')
    await flushPromises()
    expect(msgBoxConfirm).toBeCalledWith(ui.Game.SCORE_NOT_SAVED)
    expect(pushToHome).toHaveBeenCalledWith({ name: 'Scoreboard'})
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

async function customMockGameShallowMount(mocksToUse) {
  const wrapper = shallowMount(Game, {
    mocks: mocksToUse
  })
  await flushPromises()
  return wrapper
}
