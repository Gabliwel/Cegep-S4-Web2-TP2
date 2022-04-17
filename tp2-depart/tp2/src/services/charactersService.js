import * as axios from 'axios'
import { API } from '../../shared/config.js'

async function getNbCharacters () {
  const response = await axios.get(`${API}/characters?_page=1&_limit=1`)
  return response.headers['x-total-count']
}

async function getCharacter (id) {
  const response = await axios.get(`${API}/characters?_page=` + id + '&_limit=1')
  return response.data
}

async function getCharacters () {
  const response = await axios.get(`${API}/characters`)
  return response.data
}

export const charactersService = {
  getNbCharacters,
  getCharacters,
  getCharacter
}
