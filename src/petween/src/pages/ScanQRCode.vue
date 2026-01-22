<template>
  <q-page class="page">
    <PageHeader title="Scan QR Code" />

    <div class="scanner-container">
      <!-- Kamera-Anzeigebereich -->
      <div class="camera-view">
        <video
          ref="videoElement"
          autoplay
          playsinline
          class="camera-video"
          :class="{ hidden: uploadedImage }"
        ></video>

        <img
          v-if="uploadedImage"
          :src="uploadedImage"
          alt="QR Code"
          class="uploaded-image"
        />
        
        <!-- Bewegende rote Scan-Linie -->
        <div v-if="showScanningLine || isScanning" class="scanning-line"></div>
        
        <!-- Verstecktes Canvas zum Lesen von QR-Code aus Video -->
        <canvas ref="canvasElement" class="hidden-canvas"></canvas>
        
        <!-- Platzhalter, wenn Kamera nicht gestartet ist -->
        <div v-if="!cameraStarted && !uploadedImage" class="scanner-placeholder">
          <div class="scanner-frame">
            <q-icon name="qr_code_scanner" class="scanner-icon" />
            <p class="scanner-text">Point camera at QR code</p>
          </div>
        </div>
      </div>

      <!-- Kamera-Steuerungs-Buttons -->
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

      <!-- ODER Trennzeichen -->
      <div class="or-separator">
        <span>-- OR --</span>
      </div>

      <!-- Upload-Bereich für QR-Code-Bilder -->
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

    <!-- Success/Error-Nachrichten -->
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
   * ScanQRCode Seiten-Komponente
   * 
   * Bietet QR-Code-Scan-Funktionalität über Kamera oder Bild-Upload.
   * Validiert gescannte QR-Codes und navigiert zur Add Friend Seite mit Ergebnissen.
   * 
   * Features:
   * - Live-Kamera QR-Code-Scanning
   * - Bild-Upload für QR-Code-Scanning
   * - Echtzeit-Validierung von gescannten QR-Codes
   * - Zentrale Fehler-/Success-Nachrichtenverwaltung über Messages Store
   */

  import { ref, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import PageHeader from 'src/components/layout/PageHeader.vue'
  import SuccessMessage from 'src/components/ui/SuccessMessage.vue'
  import { useMessagesStore } from 'src/stores/messages-store'
  import { useCamera } from 'src/composables/useCamera'

  const router = useRouter()
  const messagesStore = useMessagesStore()
  
  // Kamera- und QR-Scan-Funktionalität
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
    cleanup 
  } = useCamera()

  // Datei-Input und hochgeladenes Bild Zustand
  const fileInput = ref<HTMLInputElement | null>(null)
  const uploadedImage = ref<string | null>(null)

  /**
   * Startet die Kamera und initialisiert QR-Code-Scanning.
   * Aktiviert die Scan-Linien-Animation für visuelles Feedback.
   * @returns {Promise<void>}
   * @throws {Error} Zeigt Fehlermeldung, wenn Kamera-Zugriff fehlschlägt.
   */
  const handleStartCamera = async () => {
    try {
      await startCamera(() => {
        startQRCodeScanning(validateAndProcessQRCode)
      }, true) // Scan-Linie für QR-Code-Scanning aktivieren
    } catch (error) {
      messagesStore.showError('Unable to access camera. Please allow camera permissions.')
    }
  }

  // Stoppt Kamera und räumt alle Ressourcen auf
  const handleStopCamera = () => {
    stopQRCodeScanning()
    stopCamera()
  }

  /**
   * Validiert und verarbeitet QR-Code-Daten.
   * Navigiert zur Add Friend Seite mit validierter Friend ID oder Fehlermeldung.
   * @param {string} qrCodeData - Die rohen QR-Code-Daten vom Scanning.
   * @returns {void}
   */
  const validateAndProcessQRCode = (qrCodeData: string) => {
    const trimmedData = qrCodeData.trim()
    const isValid = /^\d+$/.test(trimmedData)
    const error = 'Invalid QR code. QR code must contain a numeric Friend ID only.'
    
    if (isValid) {
      handleStopCamera()
      router.push({ path: '/add-friend', query: { friendId: trimmedData, showSuccess: 'true' } })
    } else {
      handleStopCamera()
      router.push({ path: '/add-friend', query: { error } })
    }
  }

  // Öffnet Datei-Auswahl-Dialog
  const openGallery = () => fileInput.value?.click()

  /**
   * Verarbeitet Datei-Upload und liest QR-Code aus hochgeladenem Bild.
   * Validiert Dateityp, liest QR-Code und verarbeitet das Ergebnis.
   * @param {Event} event - Das File-Input Change-Event.
   * @returns {Promise<void>}
   */
  const handleFileUpload = async (event: Event) => {
    const imageUrl = await readImageFile(event)
    if (!imageUrl) {
      messagesStore.showError('Please select an image file')
      return
    }

    uploadedImage.value = imageUrl

    // 3 Sekunden warten, bevor gescannt wird, um Bild-Anzeige zu ermöglichen
    setTimeout(async () => {
      const qrCodeData = await scanQRFromImage(imageUrl)
      uploadedImage.value = null

      if (!qrCodeData) {
        handleStopCamera()
        router.push({ path: '/add-friend', query: { error: 'Could not read QR code. Please try again.' } })
        return
      }

      validateAndProcessQRCode(qrCodeData)
    }, 3000)
  }

  // Ressourcen aufräumen, wenn Komponente unmountet wird
  onUnmounted(() => {
    cleanup()
  })
</script>

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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  background: #ff0000;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
  animation: scanLine 2s linear infinite;
  z-index: 10;
}

@keyframes scanLine {
  0% { top: 0; opacity: 1; }
  50% { top: 50%; opacity: 0.8; }
  100% { top: 100%; opacity: 1; }
}
</style>