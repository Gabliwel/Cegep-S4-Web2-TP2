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
  test('Après 5 mission réussi, la partie est gagné et le score est sauvegardé', async () => {
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
  test('Après 5 mission réussi, la partie est gagné et le score est nest pas sauvegardé si il y a une erreur serveur', async () => {
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
  test('Si le joueur clique sur le bouton combattre la méthode "fight" devrait être appelé', async () => {
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
    const wrapper = await basicGameShallowMount()
    const spyFight = jest.spyOn(wrapper.vm, 'fight')
    await wrapper.find('#fight').trigger('click')
    await flushPromises()

    expect(spyFight).toHaveBeenCalled()
  })

  test('Si le joueur clique sur le bouton combattre la méthode "getHitChance" devrait être appelé 2 fois (1 fois le joueur et 1 fois lennemis', async () => {
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
    const wrapper = await basicGameShallowMount()
    const spyFight = jest.spyOn(wrapper.vm, 'fight')
    const spyChance = jest.spyOn(wrapper.vm, 'getHitChance')
    await wrapper.find('#fight').trigger('click')
    await flushPromises()

    expect(spyFight).toHaveBeenCalled()
    expect(spyChance).toHaveBeenCalledTimes(2)
  })

  test('Si le joueur clique sur le bouton combattre alors quil na plus de vie la méthode "loseGame" devrait être appelé', async () => {
    const msgBoxConfirm = jest.fn().mockResolvedValue(true)
    const pushToHome = jest.fn()
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
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
    const spyFight = jest.spyOn(wrapper.vm, 'fight')
    const spyLose = jest.spyOn(wrapper.vm, 'loseGame')
    await wrapper.setData({playerHealth: 0})
    await wrapper.find('#fight').trigger('click')
    await flushPromises()

    expect(spyFight).toHaveBeenCalled()
    expect(spyLose).toHaveBeenCalled()
  })

  test('Si le joueur clique sur le bouton combattre alors que lennemis na plus de vie la mission en cours doit augmenter, "selectRandomEnemy" doit être appeler et les credits du joueur doit augmenter', async () => {
    const msgBoxConfirm = jest.fn().mockResolvedValue(true)
    const pushToHome = jest.fn()
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
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
    const spyFight = jest.spyOn(wrapper.vm, 'fight')
    const spySRE = jest.spyOn(wrapper.vm, 'selectRandomEnemy')
    await wrapper.setData({enemyHealth: 0})
    await wrapper.find('#fight').trigger('click')
    await flushPromises()

    expect(spyFight).toHaveBeenCalled()
    expect(spySRE).toHaveBeenCalled()
    expect(wrapper.vm.player.credit).toEqual(wrapper.vm.enemy.credit)
    expect(wrapper.vm.nbFight).toEqual(2)
  })
  test('Si le joueur clique sur le bouton combattre alors que lennemis a 0 point de vie et le joueur a 5 mission completer "winGame" devrait être appeler', async () => {
    const msgBoxConfirm = jest.fn().mockResolvedValue(true)
    const pushToHome = jest.fn()
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
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
    const spyFight = jest.spyOn(wrapper.vm, 'fight')
    const spyWin = jest.spyOn(wrapper.vm, 'winGame')
    await wrapper.setData({nbFight: 5})
    await wrapper.setData({enemyHealth: 0})
    await wrapper.find('#fight').trigger('click')
    await flushPromises()

    expect(spyFight).toHaveBeenCalled()
    expect(spyWin).toHaveBeenCalled()
    expect(wrapper.vm.nbFight).toEqual(5)
  })
  test('Si le joueur clique sur le bouton combattre alors que lennemis a 0 point de vie et le joueur a plus de 5 mission completer "winGame" devrait être appeler', async () => {
    const msgBoxConfirm = jest.fn().mockResolvedValue(true)
    const pushToHome = jest.fn()
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
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
    const spyFight = jest.spyOn(wrapper.vm, 'fight')
    const spyWin = jest.spyOn(wrapper.vm, 'winGame')
    await wrapper.setData({nbFight: 10})
    await wrapper.setData({enemyHealth: 0})
    await wrapper.find('#fight').trigger('click')
    await flushPromises()

    expect(spyFight).toHaveBeenCalled()
    expect(spyWin).toHaveBeenCalled()
  })
  test('Si le joueur clique sur le bouton terminer la méthode "endFight" devrait être appelé', async () => {
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
    const wrapper = await basicGameShallowMount()
    const spyEnd = jest.spyOn(wrapper.vm, 'endFight')
    await wrapper.find('#end').trigger('click')
    await flushPromises()

    expect(spyEnd).toHaveBeenCalled()
  })

  test('Si le joueur clique sur le bouton terminer sans avoir atteint 5 missions de fait la méthode "selectRandomEnemy" devrait être appelé', async () => {
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
    const wrapper = await basicGameShallowMount()
    const spyEnd = jest.spyOn(wrapper.vm, 'endFight')
    const spySRE = jest.spyOn(wrapper.vm, 'selectRandomEnemy')
    await wrapper.find('#end').trigger('click')
    await flushPromises()

    expect(spyEnd).toHaveBeenCalled()
    expect(spySRE).toHaveBeenCalled()
  })

  test('Si le joueur clique sur le bouton terminer après 5 mission de fait la méthode "winGame" devrait être appelé', async () => {
    const msgBoxConfirm = jest.fn().mockResolvedValue(true)
    const pushToHome = jest.fn()
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
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
    const spyEnd = jest.spyOn(wrapper.vm, 'endFight')
    const spyWin = jest.spyOn(wrapper.vm, 'winGame')
    await wrapper.setData({nbFight: 5})
    await wrapper.find('#end').trigger('click')
    await flushPromises()

    expect(spyEnd).toHaveBeenCalled()
    expect(spyWin).toHaveBeenCalled()
  })
  test('Si le joueur clique sur le bouton terminer la mission et reparer le vaisseau alors que le vaisseau a moins de 100 points de vie et plus de 5 crédit galactique la méthode "repairShip" et "endFight" devrait être appelé', async () => {
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
    const wrapper = await basicGameShallowMount()
    const spyRepair = jest.spyOn(wrapper.vm, 'repairShip')
    const spyEnd = jest.spyOn(wrapper.vm, 'endFight')
    await wrapper.setData({player: { credit:10 }})
    await wrapper.setData({playerHealth: 90})
    await wrapper.find('#repair').trigger('click')
    await flushPromises()

    expect(spyRepair).toHaveBeenCalled()
    expect(spyEnd).toHaveBeenCalled()
  })

  test('Si le joueur clique sur le bouton terminer la mission et reparer le vaisseau alors que le vaisseau a 100 points de vie la méthode "repairShip" et "makeToast" devrait être appelé pour avoir déja le maximum de vie', async () => {
    const msgToast = jest.fn().mockResolvedValue(true)
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
    const wrapper = await customMockGameShallowMount({
      $bvToast: {
        toast: param => msgToast(param)
      },
      $route: {
        params: {
          name: ANY_NAME,
          ship: ANY_SHIP
        }
      }
    })
    const spyRepair = jest.spyOn(wrapper.vm, 'repairShip')
    const spyToast = jest.spyOn(wrapper.vm, 'makeToast')
    await wrapper.setData({player: { credit:10 }})
    await wrapper.setData({playerHealth: 100})
    await wrapper.find('#repair').trigger('click')
    await flushPromises()

    expect(spyRepair).toHaveBeenCalled()
    expect(spyToast).toHaveBeenCalledWith(ui.Game.REPAIR_SHIP_ALREADY_MAXED, ui.IMPOSSIBLE_ACTION_ERROR_TITLE)
  })
  test('Si le joueur clique sur le bouton terminer la mission et reparer le vaisseau alors que le vaisseau a plus 100 points de vie la méthode "repairShip" et "makeToast" devrait être appelé pour avoir déja le maximum de vie', async () => {
    const msgToast = jest.fn().mockResolvedValue(true)
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
    const wrapper = await customMockGameShallowMount({
      $bvToast: {
        toast: param => msgToast(param)
      },
      $route: {
        params: {
          name: ANY_NAME,
          ship: ANY_SHIP
        }
      }
    })
    const spyRepair = jest.spyOn(wrapper.vm, 'repairShip')
    const spyToast = jest.spyOn(wrapper.vm, 'makeToast')
    await wrapper.setData({player: { credit:10 }})
    await wrapper.setData({playerHealth: 1000})
    await wrapper.find('#repair').trigger('click')
    await flushPromises()

    expect(spyRepair).toHaveBeenCalled()
    expect(spyToast).toHaveBeenCalledWith(ui.Game.REPAIR_SHIP_ALREADY_MAXED, ui.IMPOSSIBLE_ACTION_ERROR_TITLE)
  })
  test('Si le joueur clique sur le bouton terminer la mission et reparer le vaisseau alors que le joueur a 0 crédit galactique la méthode "repairShip" et "makeToast" devrait être appelé pour ne pas avoir asser de crédit galactique', async () => {
    const msgToast = jest.fn().mockResolvedValue(true)
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
    const wrapper = await customMockGameShallowMount({
      $bvToast: {
        toast: param => msgToast(param)
      },
      $route: {
        params: {
          name: ANY_NAME,
          ship: ANY_SHIP
        }
      }
    })
    const spyRepair = jest.spyOn(wrapper.vm, 'repairShip')
    const spyToast = jest.spyOn(wrapper.vm, 'makeToast')
    await wrapper.setData({player: { credit:0 }})
    await wrapper.setData({playerHealth: 10})
    await wrapper.find('#repair').trigger('click')
    await flushPromises()

    expect(spyRepair).toHaveBeenCalled()
    expect(spyToast).toHaveBeenCalledWith(ui.Game.REPAIR_SHIP_MISSING_CG, ui.IMPOSSIBLE_ACTION_ERROR_TITLE)
  })
  test('Si le joueur clique sur le bouton terminer la mission et reparer le vaisseau alors que le vaisseau a 95 points de vie et 100 crédit galactique la méthode "repairShip" devrait être appelé et le vaisseau devrait avoir 100 points de vie et 75 crédits galactique restant', async () => {
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
    const wrapper = await basicGameShallowMount()
    const spyRepair = jest.spyOn(wrapper.vm, 'repairShip')
    await wrapper.setData({player: { credit:100 }})
    await wrapper.setData({playerHealth: 95})
    await wrapper.find('#repair').trigger('click')
    await flushPromises()

    expect(spyRepair).toHaveBeenCalled()
    expect(wrapper.vm.playerHealth).toBe(100)
    expect(wrapper.vm.player.credit).toBe(75)
  })
  test('Si le joueur clique sur le bouton terminer la mission et reparer le vaisseau alors que le vaisseau a 50 points de vie et 100 crédit galactique la méthode "repairShip" devrait être appelé et le vaisseau devrait avoir 70 points de vie et 0 crédits galactique restant', async () => {
    charactersService.getNbCharacters.mockResolvedValue(10)
    charactersService.getCharacter.mockResolvedValue([characters[1]])
    const wrapper = await basicGameShallowMount()
    const spyRepair = jest.spyOn(wrapper.vm, 'repairShip')
    await wrapper.setData({player: { credit:100 }})
    await wrapper.setData({playerHealth: 50})
    await wrapper.find('#repair').trigger('click')
    await flushPromises()

    expect(spyRepair).toHaveBeenCalled()
    expect(wrapper.vm.playerHealth).toBe(70)
    expect(wrapper.vm.player.credit).toBe(0)
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
