import { api } from './api'
import type { User } from './types'

export async function getUser(userId: number): Promise<User> {
    const res = await api.get(`/users/${userId}`)
    return res.data
}

export async function createUser(name: string): Promise<User> {
    const res = await api.post('/users', { name })
    return res.data
}
