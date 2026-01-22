<template>
  <q-page class="page">
    <PageHeader title="Add Picture" />
    
    <div class="camera-view">
      <video
        ref="videoElement"
        autoplay
        playsinline
        class="camera-video"
        :class="{ hidden: !cameraStarted || capturedImage }"
      />
      <img
        v-if="capturedImage"
        :src="capturedImage"
        alt="Captured image"
        class="captured-image"
      />
      <div v-if="!cameraStarted && !capturedImage" class="camera-placeholder">
        <q-icon name="photo_camera" class="placeholder-icon" />
      </div>
      
      <div v-if="cameraStarted && !capturedImage" class="action-buttons">
        <q-btn
          round
          size="lg"
          class="capture-btn"
          icon="camera_alt"
          @click="handleCapture"
        />
      </div>
    </div>

    <!-- Gallery Preview Buttons - فقط عندما لا توجد صورة -->
    <div v-if="!capturedImage" class="gallery-previews">
      <q-btn
        v-for="i in 3"
        :key="i"
        flat
        class="gallery-btn"
        @click="openGallery"
      >
        <span>Galerie</span>
        <span>Vorschau</span>
      </q-btn>
    </div>

    <!-- Send To Button - فقط عندما توجد صورة -->
    <div v-if="capturedImage" class="send-to-section">
      <q-btn
        class="send-to-btn"
        label="send to"
        @click="goToSendPicture"
      />
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="file-input"
      @change="handleFileSelect"
    />

    <!-- Success/Error Messages -->
    <SuccessMessage 
      v-if="messagesStore.show && messagesStore.message"
      :show="messagesStore.show" 
      :message="messagesStore.message || ''" 
      :type="messagesStore.type || 'success'"
    />
  </q-page>
</template>

<script setup lang="ts">
  /**
   * AddPicture Page Component
   * 
   * Ermöglicht das Aufnehmen von Bildern über die Kamera oder Auswahl aus der Galerie.
   * Enables capturing images via camera or selecting from gallery.
   */
  
  import { ref, onMounted, onUnmounted, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import PageHeader from 'src/components/layout/PageHeader.vue'
  import SuccessMessage from 'src/components/ui/SuccessMessage.vue'
  import { useMessagesStore } from 'src/stores/messages-store'
  import { useCamera } from 'src/composables/useCamera'

  const router = useRouter()
  const messagesStore = useMessagesStore()
  const { videoElement, cameraStarted, startCamera, stopCamera, captureImage, readImageFile, cleanup } = useCamera()

  const fileInput = ref<HTMLInputElement | null>(null)
  const capturedImage = ref<string | null>(null)

  // Startet die Kamera mit Fehlerbehandlung
  const handleStartCamera = async () => {
    try {
      await startCamera()
    } catch (error) {
      messagesStore.showError('Unable to access camera. Please allow camera permissions.')
    }
  }

  /**
   * Behandelt Klick auf Aufnahme-Button.
   * Erfasst ein Bild aus dem Video-Stream und stoppt die Kamera.
   * @returns {void}
   */
  const handleCapture = () => {
    if (!cameraStarted.value) return
    
    const imageDataUrl = captureImage()
    if (imageDataUrl) {
      capturedImage.value = imageDataUrl
      stopCamera()
    }
  }

  // Öffnet Datei-Auswahl-Dialog zur Bildauswahl aus Galerie
  const openGallery = () => fileInput.value?.click()

  /**
   * Behandelt Dateiauswahl aus Galerie.
   * Validiert den Dateityp und zeigt das ausgewählte Bild an.
   * @param {Event} event - Das File-Input Change-Event.
   * @returns {Promise<void>}
   */
  const handleFileSelect = async (event: Event) => {
    const imageUrl = await readImageFile(event)
    if (!imageUrl) {
      messagesStore.showError('Please select an image file')
      return
    }
    capturedImage.value = imageUrl
    stopCamera()
  }

  /**
   * Navigiert إلى صفحة Send Picture مع تمرير الصورة
   */
  const goToSendPicture = () => {
    if (!capturedImage.value) return
    router.push({
      path: '/send-picture',
      query: { image: capturedImage.value }
    })
  }

  // Start camera automatically when component mounts
  // Use nextTick to ensure video element is mounted
  onMounted(async () => {
    await nextTick()
    handleStartCamera()
  })

  // Cleanup camera stream on component unmount
  onUnmounted(() => cleanup())
</script>

<style scoped lang="scss">
.page {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 0.5rem 1rem calc(2rem + 5.5rem);
  background: var(--q-background);
}

.camera-view {
  width: 100%;
  min-height: 500px;
  background: var(--q-primary);
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.camera-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  &.hidden {
    display: none;
  }
}

.captured-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.placeholder-icon {
  font-size: 5rem;
  color: var(--q-text);
  opacity: 0.5;
}

.action-buttons {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  z-index: 10;
}

.capture-btn {
  width: 70px;
  height: 70px;
  background: var(--q-accent);
  color: var(--q-text);
}

.gallery-previews {
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem 2rem;
  margin-top: 1rem;
}

.gallery-btn {
  flex: 1;
  background: var(--q-secondary);
  color: var(--q-text);
  border-radius: 8px;
  min-height: 90px;
  text-transform: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
}

.file-input {
  display: none;
}

.send-to-section {
  padding: 0 1rem 2rem;
  margin-top: 1rem;
}

.send-to-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  background: var(--q-primary);
  color: var(--q-text);
  border-radius: 8px;
  text-transform: none;
}
</style>
