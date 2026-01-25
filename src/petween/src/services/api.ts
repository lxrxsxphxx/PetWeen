// src/services/api.ts
import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json'
    }
})

export async function createPet(pet: {
  name: string
  species: string
  size: number
  chunky: number
  owner_ids: number[]
}) {
  return api.post('/pets', pet)
}
