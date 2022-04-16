import * as axios from 'axios'
import { API } from '../../shared/config.js'

async function getNbCharacters () {
  const response = await axios.get(`${API}/characters`)
  return response.data.length
}

async function getCharacter (id) {
  const response = await axios.get(`${API}/characters?_page=` + id + '&_limit=1')
  return response.data
}

export const charactersService = {
  getNbCharacters,
  getCharacter
}
