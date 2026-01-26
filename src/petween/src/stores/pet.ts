import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePetStore = defineStore('pet', () => {
  // --- STATE ---
  const pet = ref({
    id: 1,
    name: 'Froppy',
    hunger: 40,     // 0 = voll, 100 = hungrig
    hygiene: 60,    // 0 = sauber, 100 = dreckig
    happiness: 50,  // 0 = traurig, 100 = happy
  })

  // --- GETTERS ---
  const isHungry = computed(() => pet.value.hunger > 70)
  const isDirty = computed(() => pet.value.hygiene > 70)

  // --- ACTIONS ---
  function feed() {
    pet.value.hunger = Math.max(0, pet.value.hunger - 20)
    pet.value.happiness = Math.min(100, pet.value.happiness + 5)
  }

  function wash() {
    pet.value.hygiene = Math.max(0, pet.value.hygiene - 30)
    pet.value.happiness = Math.min(100, pet.value.happiness + 3)
  }

  function cuddle() {
    pet.value.happiness = Math.min(100, pet.value.happiness + 15)
  }

  function tick() {
    // wird später z. B. per Timer aufgerufen
    pet.value.hunger = Math.min(100, pet.value.hunger + 1)
    pet.value.hygiene = Math.min(100, pet.value.hygiene + 1)
    pet.value.happiness = Math.max(0, pet.value.happiness - 1)
  }

  return {
    pet,
    isHungry,
    isDirty,
    feed,
    wash,
    cuddle,
    tick,
  }
})
