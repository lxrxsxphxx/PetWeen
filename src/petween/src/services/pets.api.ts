import { api } from './api'
import type { Pet, PetCreate } from './types'

export async function createPet(
    ownerId: number,
    payload: PetCreate
): Promise<Pet> {
    const res = await api.post(`/users/${ownerId}/pets`, payload)
    return res.data
}

export async function getMyPets(
    userId: number
): Promise<Pet[]> {
    const res = await api.get(`/users/${userId}/pets`)
    return res.data
}
