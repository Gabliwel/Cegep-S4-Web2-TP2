import * as axios from 'axios'
import { API } from '../../shared/config.js'

async function getRanking () {
  const response = await axios.get(`${API}/ranking`)
  return response.data
}

export const rankingService = {
  getRanking
}
