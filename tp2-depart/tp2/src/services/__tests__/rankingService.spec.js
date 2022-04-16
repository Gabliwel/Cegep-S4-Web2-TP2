import axios from 'axios'
import { rankingJsonFake } from '@/../tests/data/rankingJsonFake'
import { rankingService } from '@/services/rankingService'
import MockAdapter from 'axios-mock-adapter'

// jest.mock('axios')
var mockAxios = new MockAdapter(axios)

const API = process.env.VUE_APP_API
let scores

beforeEach(() => {
  scores = [...rankingJsonFake]
  mockAxios.reset()
})

describe('rankingService.js', () => {
  test("getRanking doit retourner l'ensemble des scores", async () => {
    mockAxios.onGet(`${API}/ranking`).reply(200, scores)
    const response = await rankingService.getRanking()
    expect(response).toStrictEqual(scores)
  })
  test("postRanking ajoute le ranking et le retourne", async () => {
    mockAxios.onPost(`${API}/ranking`).reply(201, { name: "test", scores: 999})
    const response = await rankingService.postRanking({ name: "test", scores: 999})
    expect(response).toStrictEqual({ name: "test", scores: 999})
  })
})