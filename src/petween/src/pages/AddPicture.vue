<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import PageHeader from 'src/components/layout/PageHeader.vue'
import SuccessMessage from 'src/components/ui/SuccessMessage.vue'

import { useMessagesStore } from 'src/stores/messages-store'
import { useCamera } from 'src/composables/useCamera'

const router = useRouter()
const messagesStore = useMessagesStore()

const {
  videoElement,
  cameraStarted,
  startCamera,
  stopCamera,
  captureImage,
  readImageFile,
  cleanup,
} = useCamera()

const fileInput = ref<HTMLInputElement | null>(null)
const uploadedImage = ref<string | null>(null)

function openGallery() {
  fileInput.value?.click()
}

async function handleStartCamera() {
  try {
    await startCamera()
  } catch {
    messagesStore.showError('Unable to access camera. Please allow camera permissions.')
  }
}

function handleStopCamera() {
  stopCamera()
}

function capturePhoto() {
  const image = captureImage()

  if (!image) {
    messagesStore.showError('Failed to capture image. Please try again.')
    return
  }

  messagesStore.showSuccess('Picture captured!')

  window.setTimeout(() => {
    router.push('/send-picture')
  }, 700)
}

async function handleFileUpload(event: Event) {
  const imageUrl = await readImageFile(event)
  if (!imageUrl) {
    messagesStore.showError('Please select an image file')
    return
  }

  uploadedImage.value = imageUrl
  messagesStore.showSuccess('Image uploaded!')

  window.setTimeout(() => {
    uploadedImage.value = null
    router.push('/send-picture')
  }, 700)
}

onMounted(() => {
  // Auto-start for the prototype (same behavior as the colleague version)
  handleStartCamera()
})

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <q-page class="page">
    <PageHeader 
      back
      @back="router.back()"
      title="Add Picture" 
    />

    <div class="camera-container">
      <div class="camera-view">
        <video
          ref="videoElement"
          autoplay
          playsinline
          class="camera-video"
          :class="{ hidden: uploadedImage }"
        />

        <img v-if="uploadedImage" :src="uploadedImage" alt="Preview" class="uploaded-image" />

        <div v-if="!cameraStarted && !uploadedImage" class="camera-placeholder">
          <q-icon name="camera_alt" class="placeholder-icon" />
          <p class="placeholder-text">Tap to start camera</p>
        </div>
      </div>

      <div class="camera-controls">
        <q-btn
          v-if="!cameraStarted"
          class="start-camera-btn"
          label="Start Camera"
          @click="handleStartCamera"
        />
        <q-btn
          v-else
          class="stop-camera-btn"
          label="Stop Camera"
          @click="handleStopCamera"
        />
      </div>

      <div v-if="cameraStarted" class="action-buttons">
        <q-btn
          class="capture-btn"
          icon="camera"
          label="Capture"
          @click="capturePhoto"
        />
      </div>

      <div class="or-separator">
        <span>-- OR --</span>
      </div>

      <div class="upload-section">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="file-input"
          @change="handleFileUpload"
        />
        <q-btn
          class="upload-btn"
          label="Upload Image"
          icon="image"
          @click="openGallery"
        />
      </div>
    </div>

    <SuccessMessage
      v-if="messagesStore.show && messagesStore.message"
      :show="messagesStore.show"
      :message="messagesStore.message"
      :type="messagesStore.type || 'success'"
    />
  </q-page>
</template>

<style scoped lang="scss">
.page {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 0.5rem 1rem calc(2rem + 5.5rem);
  background: var(--q-background);
}

.camera-container {
  margin-top: 2rem;
}

.camera-view {
  width: 100%;
  aspect-ratio: 1;
  background: var(--q-primary);
  border-radius: 15px;
  position: relative;
  overflow: hidden;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;

  &.hidden {
    display: none;
  }
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--q-primary);
}

.camera-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  pointer-events: none;
}

.placeholder-icon {
  font-size: 6rem;
  color: var(--q-text);
  opacity: 0.5;
}

.placeholder-text {
  color: var(--q-text);
  font-size: 1.2rem;
  opacity: 0.8;
  margin: 0;
}

.camera-controls {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.start-camera-btn,
.stop-camera-btn {
  padding: 1rem 3.5rem;
  font-size: 1rem;
  font-weight: 500;
  background: var(--q-accent);
  color: var(--q-text);
  border-radius: 8px;
  text-transform: none;
}

.action-buttons {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}

.capture-btn {
  padding: 1rem 2.5rem;
  font-size: 1rem;
  font-weight: 500;
  background: var(--q-secondary);
  color: var(--q-text);
  border-radius: 8px;
  text-transform: none;
}

.or-separator {
  text-align: center;
  margin: 2rem 0;

  span {
    color: var(--q-text);
    font-size: 1rem;
    opacity: 0.8;
  }
}

.upload-section {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.file-input {
  display: none;
}

.upload-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 500;
  background: var(--q-secondary);
  color: var(--q-text);
  border-radius: 8px;
  text-transform: none;
}
</style>
