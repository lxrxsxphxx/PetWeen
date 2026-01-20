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
        <q-btn
        unelevated
        color="primary"
        icon="add"
        class="button_add"
        @click="router.push('/add-friend_pet')"
        />
    </section>

    <!-- choose pet type -->
    <section class="section">
        <SectionHeader 
            title="choose pet type"
        />

        <DropdownMenu
            :value="petOptions"
            @petSelect="petOptions=$event"
            :options="petOptions"
        />
    </section>

    <section
        class="preview-section"
        :class="{ expanded: customizationMode }"
    >
        <div
            v-if="!customizationMode"
            class="color-picker"
        >
            <q-btn round size="md" color="red" @click="selectedColor = 'red'" />
            <q-btn round size="md" color="blue" @click="selectedColor = 'blue'" />
            <q-btn round size="md" color="green" @click="selectedColor = 'green'" />
        </div>

        <div
            class="pet-preview"
            :style="{ borderColor: selectedColor }"
        >
            <q-icon name="aspect_ratio" size="180px" />
        </div>
    </section>



    <!-- Actions -->
    <div class="actions">

        <!-- before confirm colours -->
        <template v-if="!customizationMode">

            <q-btn
                color="primary"
                label="Confirm"
                @click="customizationMode = true"
            />
        </template>

        <!-- after confirm sliders-->
        <template v-else>
            <div class="slider">
                <div class="slider-header">
                    <span class="label">Size</span>
                    
                </div>

                <q-slider
                    v-model="size"
                    label
                    label-always
                    :min="0"
                    :max="100"
                />

                <div class="slider-header">
                    <span class="label">chonky</span>
                    
                </div>

                <q-slider
                    v-model="chonky"
                    label
                    label-always
                    :min="0"
                    :max="100"
                />

            </div>

            <q-btn
                color="primary"
                label="Finish Adoption"
                class="q-mt-md"
                @click="$router.push('/care')"
            />
        </template>

    </div>

</q-page>
</template>



<script setup lang="ts">
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    //import DropdownMenu from 'src/components/DropdownMenu.vue'
    import PageHeader from 'src/components/layout/PageHeader.vue'
    import SectionHeader from 'src/components/layout/SectionHeader.vue'

    const petType = ref<string | null>(null)
    const customizationMode = ref(false)
    const selectedColor = ref('grey')
    const router = useRouter()

    // Slider Values
    const size = ref(50)
    const chonky = ref(70)

    const petOptions = ['Frog', 'Cat', 'Dino']

    function handleBack() {
        if (customizationMode.value) {
            customizationMode.value = false
        } else
        router.back()
    }

</script>

<style scoped lang="scss">

    .button {
        width: 30px;
        height: 30px;
        margin-top: 0rem;


    }
    
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


    //Pet Preview & Color Picker
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
        max-width: 320px;
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

    .actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

</style>