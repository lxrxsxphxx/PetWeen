<template>
    <q-page class="page takecare-page">

        <!-- Page Header mit Pet-Namen -->
        <PageHeader 
            :title="pet.name" 
            back 
            @back="handleBack" 
        />

        <!-- Pet -->
        <section class="pet-preview-section">
            <div class="pet-preview">
                <q-icon name="aspect_ratio" />
            </div>
        </section>

        <!-- Action Buttons unten -->
        <div class="takecare-actions">
            <q-circular-progress
                :value="pet.happiness || 0"
                size="72px"
                color="pink"
            >
            <q-btn 
                round 
                flat 
                icon="favorite" 
                @click="cuddle" 
            />
            </q-circular-progress>

            <q-circular-progress
                :value="100 - pet.hunger || 0"
                size="72px"
                color="orange"
                track-color="grey-3"
                show-value
            >
            <q-btn 
                round 
                flat 
                icon="dinner_dining" 
                @click="feed" 
            />
            </q-circular-progress>

            <q-circular-progress
                :value="100 - pet.hygiene || 0"
                size="72px"
                color="blue"
                track-color="grey-3"
            >
            <q-btn 
                round 
                flat 
                icon="shower" 
                @click="wash" 
            />
            </q-circular-progress>

            <q-circular-progress
                :value="100"
                size="72px"
                color="grey"
            >
            <q-btn 
                round 
                flat 
                icon="add_a_photo" 
                @click="takePicture"
            />
            </q-circular-progress>
        </div>
    </q-page>
</template>

<script setup lang="ts">
    import { computed, ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { usePetStore } from 'src/stores/pet'
    import PageHeader from 'src/components/layout/PageHeader.vue'
    
    const router = useRouter()
    
    function handleBack() {
            router.back()
    }
    
    const petStore = usePetStore()
    const {pet, feed, wash, cuddle } = petStore
    
    const happiness = computed(() => pet.value?.happiness ?? 0)
    const hunger = computed(() => pet.value?.hunger ?? 0)
    const hygiene = computed(() => pet.value?.hygiene ?? 0)
    
    
    function takePicture() {
        console.log('Picture taken')
    }

</script>


<style scoped lang="scss">
    .takecare-page {
        position: relative;
        padding-bottom: 100px; 
    }

    .pet-preview-section {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 2rem;
    }

    .pet-preview {
        width: 250px;
        height: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .takecare-actions {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-around;
        padding: 1rem 0;
        z-index: 20;
    }
</style>
