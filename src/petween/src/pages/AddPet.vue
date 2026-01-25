<template>
<q-page class="page">

    <!-- Header -->
    <PageHeader
        title="Adopt a pet"
        back
        @back="handleBack"
    />

    <!-- add friend -->
    <section class="section">
        <SectionHeader title="Add friend" />
        <!--
        <q-btn
            unelevated
            color="primary"
            icon="add"
            class="button_add"
            @click="router.push('/add-friend_pet')"
        />
        -->


        <q-select
            v-model="selectedFriendIds"
            :options="friendOptions"
            multiple
            emit-value
            map-options
            use-chips
            outlined
            dense
            placeholder="Select friends (optional)"
        />


    </section>


    <!-- Input for pet name -->
    <section
        v-if="!customizationMode"
        class="section"
    >
        <SectionHeader title="pet name" />
            <q-input
                v-model="petPayload.name"
                placeholder="Enter pet name"
                outlined
                dense
                maxlength="20"
                class="q-mb-md"
            />

        <SectionHeader title="choose pet type"/>

        <!-- Dropdown Menu for pet selection -->
            <DropdownMenu
                :value="petPayload.species"
                @petSelect="petPayload.species=$event"
                :options="petOptions"
            />
    </section>


    <!-- Pet Preview and Customization -->
    <section
        class="preview-section"
        :class="{ expanded: customizationMode }"
    >
    <!-- Color Picker (only in customization mode) -->
        <div
            v-if="!customizationMode"
            class="color-picker"
        >
            <q-btn 
                round size="md" 
                color="red" 
                @click="selectedColor = 'red'" 
            />

            <q-btn 
                round size="md" 
                color="blue" 
                @click="selectedColor = 'blue'"
            />
            
            <q-btn 
                round size="md" 
                color="green" 
                @click="selectedColor = 'green'" 
            />
        </div>

        <!-- Pet Preview Box -->
        <div
            class="pet-preview"
            :style="{ borderColor: selectedColor }"
        >
            <q-icon name="aspect_ratio" size="180px" />
        </div>
    </section>

        <!-- after confirm-->
        <!-- Slider for customization -->
        <section v-if="customizationMode" class="slider">
                <div class="slider-header">
                    <span class="label">Size</span>    
                </div>

                <q-slider
                    v-model="petPayload.size"
                    label
                    label-always
                    :min="0"
                    :max="100"
                />

                <div class="slider-header">
                    <span class="label">chonky</span>
                </div>

                <q-slider
                    v-model="petPayload.chunky"
                    label
                    label-always
                    :min="0"
                    :max="100"
                />
        </section>

            <!-- Actions -->
        <div class="btn-action">
            <q-btn
                color="primary"
                class="action-btn"
                :label="customizationMode ? 'Finish Adoption' : 'Confirm'"
                @click="handlePrimaryAction"
            />
        </div>

</q-page>
</template>



<script setup lang="ts">

    /**
     * Imports
     * PageHeader: main page header with back button
     * SectionHeader: section title component
     * DropdownMenu: custom dropdown menu for pet selection
     *
     * Logic for handling pet addition and customization.
     */
    import { computed, onMounted, ref } from 'vue'
    import { useRouter } from 'vue-router'

    import DropdownMenu from 'src/components/ui/DropdownMenu.vue'
    import PageHeader from 'src/components/layout/PageHeader.vue'
    import SectionHeader from 'src/components/layout/SectionHeader.vue'

    import { createPet as createPetApi } from 'src/services/api'
    import { useUserStore } from 'src/stores/user'

    // State Variables for customization mode and selected options
    const customizationMode = ref(false)
    const selectedColor = ref('grey')
    const router = useRouter()

    const selectedFriendIds = ref<number[]>([])

    // Dropdown Menu Options
    const petOptions = ['Frog', 'Cat', 'Dino']

    const userStore = useUserStore()

    const petPayload = ref({
        name: '',
        species: 'Frog',
        size: 50,
        chunky: 50,
        owner_ids: [] as number[]
    })



    const friendOptions = computed(() =>
        userStore.friends
        .filter(friend => friend.id !== userStore.id)
        .map(friend => ({
            label: friend.name,
            value: friend.id
        }))
    )

    onMounted(() => {
        userStore.loadUser(1)
    })
    /**
     * Handles the back button click.
     *  If in customization mode, exits customization mode.
     *  Otherwise, navigates back to the previous page.
     */
    function handleBack() {
        if (customizationMode.value) {
            customizationMode.value = false
        } else
        router.back()
    }

    async function createPet() {

        if(!userStore.id){
            console.error('User not loaded')
            return
        }

        try{
            await createPetApi(petPayload.value)
            await userStore.loadUser(userStore.id)
        } catch (err) {
            console.error('Pet create failed', err)
        }
    }

    /**
     * Handles the primary action button click.
     *  If not in customization mode, enters customization mode.
     *  If already in customization mode, navigates to the care page.
     */
    async function handlePrimaryAction() {
        if (!customizationMode.value) {
            customizationMode.value = true
        } else {
            await createPet()
            router.push('/care')
        }
    }


</script>

<style scoped lang="scss">


    // Add Friend Button
    .button_add {
        width: 50px;
        height: 50px;
        padding: 0;
        min-height: 0;
        min-width: 0;
        border-radius: 10px;
        margin: 0.5rem;
    }

    .section {
        margin-bottom: 1rem;
    }

    .section-header {
        margin-top: 1rem;
    }

    //Pet Preview Section
    .preview-section {
        display: grid;
        grid-template-columns: auto minmax(200px, 1fr);
        align-items: center;
        column-gap: 2rem;
        margin-bottom: 2rem;
    }

        .preview-section.expanded {
            grid-template-columns: 1fr;
        }

    /* Color Picker */
    .color-picker {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }

    /* Pet Preview */
    .pet-preview {
        width: 100%;
        max-width: 250px;
        aspect-ratio: 1 / 1;
        border: 3px dashed;
        border-radius: 12px;
        
        display: flex;
        align-items: center;
        justify-content: center;
        
        transition: max-width 0.35s ease;
    }

        .preview-section.expanded .pet-preview {
            margin: 0 auto;
            max-width: 200px;
        }

    // Sliders
    .slider {
        margin-bottom: 1rem;

        .label {
            font-size: 1.2rem;
        }

        .track {
            transition: background-color 0.2s ease;
        }

    }

        .slider-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }

    // Action Button Confirm and Finish Adoption
    .btn-action {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 130px; // knapp über Bottom Nav
        
        display: flex;
        justify-content: center;
        padding: 0 1rem;
        z-index: 10;
    }

    .action-btn {
        width: 100%;
        max-width: 420px;
        height: 52px;
        font-size: 1.1rem;
        border-radius: 14px;
    }

    :deep(.options-to-filter) {
        width: 430px;
        margin: 0 auto;
    }

    .q-input{
        border-radius: 10px;
        margin: 0.7rem;
    }


</style>