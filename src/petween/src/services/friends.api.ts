import { api } from './api'
import type { User } from './types'

export async function addFriend(
    userId: number,
    friendId: number
) {
    await api.post(`/users/${userId}/friends/${friendId}`)
}

export async function getFriends(
    userId: number
): Promise<User[]> {
    const res = await api.get(`/users/${userId}/friends`)
    return res.data
}
