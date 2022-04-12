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
})