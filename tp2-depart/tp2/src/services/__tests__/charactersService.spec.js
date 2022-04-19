import axios from 'axios'
import { charactersJsonFake } from '@/../tests/data/charactersJsonFake'
import { charactersService } from '@/services/charactersService'
import MockAdapter from 'axios-mock-adapter'

// jest.mock('axios')
var mockAxios = new MockAdapter(axios)
const API = process.env.VUE_APP_API
let characters

beforeEach(() => {
  characters = [...charactersJsonFake]
  mockAxios.reset()
})

describe('charactersService.js', () => {
  test("getNbCharacters doit retourner le nombre d'ennemie", async () => {
    const nbCharacters = characters.length
    mockAxios.onGet(`${API}/characters`).reply(200, characters)
    const response = await charactersService.getNbCharacters()
    expect(response).toStrictEqual(nbCharacters)
  })
  test("getCharacter doit retourner un ennemie", async () => {
    const character = characters[0]
    mockAxios.onGet(`${API}/characters?_page=1&_limit=1`).reply(200, character)
    const response = await charactersService.getCharacter(1)
    expect(response).toStrictEqual(character)
  })
})