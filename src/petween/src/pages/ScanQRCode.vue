<template>
  <!-- QR-Code-Scan-Seite -->
  <q-page class="page">
    <!-- Zurück-Button -->
    <BackButton />
    
    <!-- Seitenkopf mit Titel -->
    <PageHeader title="Scan QR Code" />

    <!-- Scanner-Bereich -->
    <div class="scanner-container">
      <!-- Kamera-/Bild-Anzeigebereich -->
      <div class="camera-view">
        <!-- Live-Kamera-Video -->
        <video
          ref="videoElement"
          autoplay
          playsinline
          class="camera-video"
          :class="{ hidden: uploadedImage }"
        ></video>

        <!-- Hochgeladenes Bild anzeigen -->
        <img
          v-if="uploadedImage"
          :src="uploadedImage"
          alt="QR Code"
          class="uploaded-image"
        />
        
        <!-- Bewegende rote Scan-Linie -->
        <div v-if="isScanning" class="scanning-line"></div>
        
        <!-- Verstecktes Canvas zum Lesen von QR-Code aus Video -->
        <canvas ref="canvasElement" class="hidden-canvas"></canvas>
        
        <!-- Hinweis, wenn Kamera nicht geöffnet ist -->
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
          @click="startCamera"
        />
        <q-btn
          v-else
          class="stop-camera-btn"
          label="Stop Camera"
          @click="stopCamera"
        />
      </div>

      <!-- "ODER"-Trennzeichen zwischen Kamera und Upload -->
      <div class="or-separator">
        <span>-- OR --</span>
      </div>

      <!-- Abschnitt zum Hochladen von QR-Code-Bildern aus Dateien -->
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
          @click="triggerFileInput"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  // Importe
  import { ref, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import PageHeader from 'src/components/layout/PageHeader.vue'
  import BackButton from 'src/components/ui/BackButton.vue'
  import jsQR from 'jsqr'

  const router = useRouter()

  // Zustandsvariablen
  const videoElement = ref<HTMLVideoElement | null>(null)
  const canvasElement = ref<HTMLCanvasElement | null>(null)
  const cameraStarted = ref(false)
  const fileInput = ref<HTMLInputElement | null>(null)
  const uploadedImage = ref<string | null>(null)
  const isScanning = ref(false)
  let stream: MediaStream | null = null
  let scanInterval: number | null = null

  // Kamera starten
  const startCamera = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })

      if (videoElement.value) {
        videoElement.value.srcObject = stream
        cameraStarted.value = true
        isScanning.value = true
        videoElement.value.onloadedmetadata = () => {
          startQRCodeScanning()
        }
      }
    } catch (error) {
      alert('Unable to access camera. Please allow camera permissions.')
    }
  }

  // Bildverarbeitung zur QR-Code-Verbesserung
  const enhanceImageForQR = (imageData: ImageData): ImageData => {
    const { data, width, height } = imageData
    const processed = new Uint8ClampedArray(data)
    const threshold = 140
    const brightness = 0.7
    const contrast = 1.5
    
    for (let i = 0; i < processed.length; i += 4) {
      let gray = processed[i] * 0.299 + processed[i + 1] * 0.587 + processed[i + 2] * 0.114
      gray = Math.max(0, Math.min(255, ((gray * brightness / 255 - 0.5) * contrast + 0.5) * 255))
      const val = gray > threshold ? 255 : 0
      processed[i] = processed[i + 1] = processed[i + 2] = val
    }
    
    return new ImageData(processed, width, height)
  }

  // QR Code aus verschiedenen Bildverarbeitungen lesen
  const tryReadQRCode = (imageData: ImageData): typeof jsQR extends (data: any, width: any, height: any) => infer R ? R : null => {
    const { data, width, height } = imageData
    const options = { inversionAttempts: 'attemptBoth' as const }
    
    // Versuch 1: Originalbild
    let qrCode = jsQR(data, width, height, { inversionAttempts: 'dontInvert' })
    if (qrCode) return qrCode
    
    // Versuch 2: Mit Inversion
    qrCode = jsQR(data, width, height, options)
    if (qrCode) return qrCode
    
    // Versuch 3: Verbessertes Bild
    const enhanced = enhanceImageForQR(imageData)
    qrCode = jsQR(enhanced.data, enhanced.width, enhanced.height, options)
    if (qrCode) return qrCode
    
    // Versuch 4: Invertiertes Bild
    const inverted = new Uint8ClampedArray(data)
    for (let i = 0; i < inverted.length; i += 4) {
      inverted[i] = 255 - inverted[i]
      inverted[i + 1] = 255 - inverted[i + 1]
      inverted[i + 2] = 255 - inverted[i + 2]
    }
    return jsQR(inverted, width, height, options)
  }

  // QR Code-Scan starten
  const startQRCodeScanning = () => {
    if (!videoElement.value || !canvasElement.value) return

    // Vorherigen Scan beenden
    if (scanInterval) {
      clearInterval(scanInterval)
      scanInterval = null
    }

    const video = videoElement.value
    const canvas = canvasElement.value
    const context = canvas.getContext('2d')
    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    let qrCodeDetectedAt: number | null = null
    let detectedQRCodeData: string | null = null
    let lastProcessedQRCode: string | null = null

    // Scan-Zustand zurücksetzen
    const resetScanState = () => {
      qrCodeDetectedAt = null
      detectedQRCodeData = null
      lastProcessedQRCode = null
    }

      // QR Code verarbeiten
    const processDetectedQRCode = (qrCodeData: string) => {
      stopQRCodeScanning()
      const isValid = /^\d+$/.test(qrCodeData)
      const error = 'Invalid QR code. QR code must contain a numeric Friend ID only.'
      
      if (isValid) {
        handleQRCodeSuccess(qrCodeData)
      } else {
        stopCamera()
        router.push({ path: '/add-friend', query: { error } })
      }
    }

    scanInterval = window.setInterval(() => {
      if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) return

      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const qrCode = tryReadQRCode(imageData)

      if (qrCode) {
        const qrCodeData = qrCode.data.trim()
        
        // Neuer Code erkannt
        if (qrCodeData !== detectedQRCodeData) {
          qrCodeDetectedAt = Date.now()
          detectedQRCodeData = qrCodeData
          isScanning.value = true
        }
        
        // Nach 2 Sekunden verarbeiten
        if (qrCodeDetectedAt && Date.now() - qrCodeDetectedAt >= 2000) {
          if (detectedQRCodeData && detectedQRCodeData !== lastProcessedQRCode) {
            lastProcessedQRCode = detectedQRCodeData
            processDetectedQRCode(detectedQRCodeData)
          }
        }
      } else {
        // QR Code verschwunden
        resetScanState()
      }
    }, 100)
  }

  // QR Code-Scan beenden
  const stopQRCodeScanning = () => {
    if (scanInterval) {
      clearInterval(scanInterval)
      scanInterval = null
    }
    isScanning.value = false
  }

  // Kamera stoppen
  const stopCamera = () => {
    if (scanInterval) {
      clearInterval(scanInterval)
      scanInterval = null
    }
    isScanning.value = false
    stream?.getTracks().forEach(track => track.stop())
    stream = null
    if (videoElement.value) videoElement.value.srcObject = null
    cameraStarted.value = false
  }

  // Nach erfolgreichem Scan navigieren
  const handleQRCodeSuccess = (friendId: string) => {
    stopCamera()
    router.push({ path: '/add-friend', query: { friendId, showSuccess: 'true' } })
  }

  // Datei-Dialog öffnen
  const triggerFileInput = () => fileInput.value?.click()

  // QR Code aus Bild lesen
  const scanQRFromImage = (imageUrl: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        context?.drawImage(img, 0, 0)
        const imageData = context?.getImageData(0, 0, canvas.width, canvas.height)
        
        if (!imageData) {
          resolve(null)
          return
        }

        const qrCode = tryReadQRCode(imageData)
        resolve(qrCode ? qrCode.data.trim() : null)
      }
      img.onerror = () => resolve(null)
      img.src = imageUrl
    })
  }

  // Datei-Upload verarbeiten
  const handleFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file || !file.type.startsWith('image/')) {
      if (file) alert('Please select an image file')
      return
    }

    const fileReader = new FileReader()
    fileReader.onload = async (e) => {
      const imageUrl = e.target?.result as string
      uploadedImage.value = imageUrl
      isScanning.value = true

      setTimeout(async () => {
        isScanning.value = false
        const qrCodeData = await scanQRFromImage(imageUrl)
        uploadedImage.value = null

        if (!qrCodeData) {
          stopCamera()
          router.push({ path: '/add-friend', query: { error: 'Could not read QR code. Please try again.' } })
          return
        }

        const isValid = /^\d+$/.test(qrCodeData.trim())
        const error = 'Invalid QR code. QR code must contain a numeric Friend ID only.'
        
        if (isValid) {
          handleQRCodeSuccess(qrCodeData)
        } else {
          stopCamera()
          router.push({ path: '/add-friend', query: { error } })
        }
      }, 3000)
    }
    fileReader.readAsDataURL(file)
  }

  // Aufräumen beim Verlassen
  onUnmounted(() => stopCamera())
</script>

<style scoped lang="scss">
.page {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 1rem;
  padding-top: 0;
  padding-bottom: 5rem;
  background: var(--q-text);
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
</style>