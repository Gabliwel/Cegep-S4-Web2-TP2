import * as axios from 'axios'
import { API } from '../../shared/config.js'

async function getRanking () {
  const response = await axios.get(`${API}/ranking`)
  return response.data
}

async function postRanking (ranking) {
  const response = await axios.post(`${API}/ranking`, ranking)
  return response.data
}

export const rankingService = {
  getRanking,
  postRanking
}
