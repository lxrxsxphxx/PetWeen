import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserById } from 'src/services/api'
import { api } from 'src/services/api'

export const useUserStore = defineStore('user', () => {
  // state
    const id = ref<number | null>(null)
    const name = ref('')
    const profileImage = ref<string | null>(null)
    const pets = ref<any[]>([])
    const friends = ref<any[]>([])

  // actions
    async function loadUser(userId: number) {
        const res = await getUserById(userId)

        id.value = res.data.id
        name.value = res.data.name
        profileImage.value = res.data.profile_image
        pets.value = res.data.pets
        friends.value = res.data.friends
    }

    function clearUser() {
        id.value = null
        name.value = ''
        profileImage.value = null
        pets.value = []
        friends.value = []
    }

    async function loadFriends() {
        if (!id) return
        const res = await api.get(`/users/${id}`)
        friends.value = res.data
}


    return {
        // state
        id,
        name,
        profileImage,
        pets,
        friends,

        // actions
        loadUser,
        clearUser,
    }
})
