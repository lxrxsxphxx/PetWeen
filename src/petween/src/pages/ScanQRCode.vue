<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import PageHeader from 'src/components/layout/PageHeader.vue'
import SuccessMessage from 'src/components/ui/SuccessMessage.vue'

import { useMessagesStore } from 'src/stores/messages-store'
import { useCamera } from 'src/composables/useCamera'

const router = useRouter()
const messagesStore = useMessagesStore()

const {
  videoElement,
  canvasElement,
  cameraStarted,
  showScanningLine,
  isScanning,
  startCamera,
  stopCamera,
  startQRCodeScanning,
  stopQRCodeScanning,
  scanQRFromImage,
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
    await startCamera(() => {
      startQRCodeScanning(validateAndProcessQRCode)
    }, true)

    if (!(window as any).BarcodeDetector) {
      messagesStore.showInfo('QR scanning is not supported in this browser. Upload an image or enter the ID manually.')
    }
  } catch {
    messagesStore.showError('Unable to access camera. Please allow camera permissions.')
  }
}

function handleStopCamera() {
  stopQRCodeScanning()
  stopCamera()
}

function validateAndProcessQRCode(qrCodeData: string) {
  const trimmedData = qrCodeData.trim()
  const isValid = /^\d+$/.test(trimmedData)

  handleStopCamera()

  if (isValid) {
    router.push({ path: '/add-friend', query: { friendId: trimmedData, showSuccess: 'true' } })
  } else {
    router.push({
      path: '/add-friend',
      query: { error: 'Invalid QR code. QR code must contain a numeric Friend ID only.' },
    })
  }
}

async function handleFileUpload(event: Event) {
  const imageUrl = await readImageFile(event)
  if (!imageUrl) {
    messagesStore.showError('Please select an image file')
    return
  }

  uploadedImage.value = imageUrl

  window.setTimeout(async () => {
    const qrCodeData = await scanQRFromImage(imageUrl)
    uploadedImage.value = null

    if (!qrCodeData) {
      handleStopCamera()
      router.push({ path: '/add-friend', query: { error: 'Could not read QR code. Please try again.' } })
      return
    }

    validateAndProcessQRCode(qrCodeData)
  }, 1500)
}

onUnmounted(() => {
  cleanup()
})
</script>

<template>
  <q-page class="page">
    <PageHeader title="Scan QR Code" />

    <div class="scanner-container">
      <div class="camera-view">
        <video
          ref="videoElement"
          autoplay
          playsinline
          class="camera-video"
          :class="{ hidden: uploadedImage }"
        />

        <img
          v-if="uploadedImage"
          :src="uploadedImage"
          alt="QR Code"
          class="uploaded-image"
        />

        <div v-if="showScanningLine || isScanning" class="scanning-line"></div>
        <canvas ref="canvasElement" class="hidden-canvas"></canvas>

        <div v-if="!cameraStarted && !uploadedImage" class="scanner-placeholder">
          <div class="scanner-frame">
            <q-icon name="qr_code_scanner" class="scanner-icon" />
            <p class="scanner-text">Point camera at QR code</p>
          </div>
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
          label="Upload QR Code"
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
  min-height: 100vh;
}

.scanner-container {
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

.scanner-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.hidden-canvas {
  display: none;
}

.scanner-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.scanner-icon {
  font-size: 8rem;
  color: var(--q-text);
  opacity: 0.5;
}

.scanner-text {
  color: var(--q-text);
  font-size: 1.3rem;
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

.scanning-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--q-accent);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.35);
  animation: scanLine 2s linear infinite;
  z-index: 10;
}

@keyframes scanLine {
  0% {
    top: 0;
    opacity: 1;
  }
  50% {
    top: 50%;
    opacity: 0.8;
  }
  100% {
    top: 100%;
    opacity: 1;
  }
}
</style>
