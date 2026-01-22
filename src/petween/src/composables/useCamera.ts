import { ref, type Ref } from 'vue'
import jsQR from 'jsqr'

/**
 * Einheitliches Composable für Kamera- und QR-Scan-Funktionalität
 * Verwaltet Kamera-Operationen, Bildaufnahme und QR-Code-Scanning
 */
export function useCamera() {
  // Video-Einschränkungen für Kamera-Zugriff
  const VIDEO_CONSTRAINTS = {
    environment: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
    user: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
  }
  const videoElement: Ref<HTMLVideoElement | null> = ref(null)
  const canvasElement: Ref<HTMLCanvasElement | null> = ref(null)
  const cameraStarted = ref(false)
  const showScanningLine = ref(false)
  const isScanning = ref(false)
  let stream: MediaStream | null = null
  let scanInterval: number | null = null

  /**
   * Startet den Kamera-Stream.
   * Fordert Zugriff auf die Gerätekamera an und zeigt das Video-Feed an.
   * Funktioniert mit mobilen Kameras und Webcams.
   * @param {Function} [onLoadedMetadata] - Optionaler Callback, wenn Kamera-Metadaten geladen sind.
   * @param {boolean} [enableScanningLine=false] - Optionales Flag, um Scan-Linie während Kamera-Betrieb anzuzeigen.
   * @returns {Promise<void>}
   * @throws {Error} Zeigt Fehlermeldung, wenn Kamera-API nicht unterstützt wird oder Zugriff fehlschlägt.
   */
  const startCamera = async (onLoadedMetadata?: () => void, enableScanningLine: boolean = false) => {
    try {
      // Prüfen, ob getUserMedia verfügbar ist (erforderlich für mobile Geräte)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported. Please use HTTPS or a mobile app wrapper.')
      }

      // Zuerst Environment-Kamera versuchen (mobile Rückkamera), Fallback auf User-Kamera (Webcam/Frontkamera)
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: VIDEO_CONSTRAINTS.environment })
      } catch {
        // Fallback auf User-Kamera (Frontkamera auf mobilem Gerät, Webcam auf Desktop)
        stream = await navigator.mediaDevices.getUserMedia({ video: VIDEO_CONSTRAINTS.user })
      }

      if (videoElement.value) {
        videoElement.value.srcObject = stream
        cameraStarted.value = true
        showScanningLine.value = enableScanningLine
        
        // Sicherstellen, dass Video abgespielt wird (wichtig für mobile Geräte)
        if (onLoadedMetadata) {
          videoElement.value.onloadedmetadata = async () => {
            try {
              await videoElement.value?.play()
              onLoadedMetadata()
            } catch (playError) {
              // Video funktioniert möglicherweise trotzdem, auch wenn play() fehlschlägt
              onLoadedMetadata()
            }
          }
        } else {
          // Video automatisch abspielen, auch ohne Callback
          videoElement.value.onloadedmetadata = async () => {
            try {
              await videoElement.value?.play()
            } catch (playError) {
              // Stiller Fehler - Video sollte trotzdem angezeigt werden
            }
          }
        }
      }
    } catch (error) {
      cameraStarted.value = false
      showScanningLine.value = false
      throw error
    }
  }

  // Stoppt den Kamera-Stream und räumt Ressourcen auf
  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop())
    stream = null
    if (videoElement.value) {
      videoElement.value.srcObject = null
    }
    cameraStarted.value = false
    showScanningLine.value = false
    stopQRCodeScanning()
  }

  /**
   * Erfasst ein Bild aus dem Video-Stream.
   * @returns {string | null} Base64-Daten-URL des erfassten Bildes oder null, wenn die Erfassung fehlschlägt.
   */
  const captureImage = (): string | null => {
    if (!videoElement.value) return null

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) return null

    canvas.width = videoElement.value.videoWidth
    canvas.height = videoElement.value.videoHeight
    context.drawImage(videoElement.value, 0, 0)

    return canvas.toDataURL('image/png')
  }

  // Versucht QR-Code aus Bilddaten zu lesen
  const tryReadQRCode = (imageData: ImageData): typeof jsQR extends (data: any, width: any, height: any) => infer R ? R : null => {
    const { data, width, height } = imageData
    const options = { inversionAttempts: 'attemptBoth' as const }
    
    // Zu versuchende Verarbeitungsmethoden
    const methods = [
      // Methode 1: Originalbild ohne Inversion
      () => jsQR(data, width, height, { inversionAttempts: 'dontInvert' }),
      // Methode 2: Originalbild mit Inversion
      () => jsQR(data, width, height, options),
      // Methode 3: Verbessertes Bild (Graustufen + Schwellenwert)
      () => {
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
        return jsQR(processed, width, height, options)
      },
      // Methode 4: Invertiertes Bild
      () => {
        const inverted = new Uint8ClampedArray(data)
        for (let i = 0; i < inverted.length; i += 4) {
          inverted[i] = 255 - inverted[i]
          inverted[i + 1] = 255 - inverted[i + 1]
          inverted[i + 2] = 255 - inverted[i + 2]
        }
        return jsQR(inverted, width, height, options)
      }
    ]
    
    // Jede Methode versuchen, bis eine erfolgreich ist
    for (const method of methods) {
      const result = method()
      if (result) return result
    }
    
    return null
  }

  /**
   * Startet kontinuierliches QR-Code-Scanning aus Video-Stream.
   * @param {Function} onQRCodeDetected - Callback, wenn QR-Code erkannt und bestätigt wurde.
   * @param {string} onQRCodeDetected.qrCodeData - Die erkannten QR-Code-Daten.
   * @returns {void}
   */
  const startQRCodeScanning = (onQRCodeDetected: (qrCodeData: string) => void) => {
    if (!videoElement.value || !canvasElement.value) return

    // Vorherigen Scan stoppen
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

    // QR-Code-Erkennungszustand
    const scanState = {
      detectedAt: null as number | null,
      qrCodeData: null as string | null,
      lastProcessed: null as string | null
    }

    const CONFIRMATION_DELAY = 2000 // 2 Sekunden Bestätigungsverzögerung

    scanInterval = window.setInterval(() => {
      if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) return

      context.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const qrCode = tryReadQRCode(imageData)

      if (qrCode) {
        const qrCodeData = qrCode.data.trim()
        
        // Neuer Code erkannt - Timer zurücksetzen
        if (qrCodeData !== scanState.qrCodeData) {
          scanState.detectedAt = Date.now()
          scanState.qrCodeData = qrCodeData
          isScanning.value = true
        }
        
        // Nach Verzögerung bestätigen und verarbeiten, wenn noch nicht verarbeitet
        if (scanState.detectedAt && 
            Date.now() - scanState.detectedAt >= CONFIRMATION_DELAY &&
            scanState.qrCodeData !== scanState.lastProcessed) {
          scanState.lastProcessed = scanState.qrCodeData
          stopQRCodeScanning()
          onQRCodeDetected(scanState.qrCodeData)
        }
      } else {
        // Zustand zurücksetzen, wenn kein QR-Code erkannt wurde
        scanState.detectedAt = null
        scanState.qrCodeData = null
        scanState.lastProcessed = null
      }
    }, 100)
  }

  // Stoppt QR-Code-Scanning
  const stopQRCodeScanning = () => {
    if (scanInterval) {
      clearInterval(scanInterval)
      scanInterval = null
    }
    isScanning.value = false
  }

  /**
   * Liest QR-Code aus einer Bild-URL.
   * @param {string} imageUrl - URL des Bildes (Base64-Daten-URL oder normale URL).
   * @returns {Promise<string | null>} Promise mit QR-Code-Daten oder null, wenn kein QR-Code gefunden wurde.
   */
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

  /**
   * Liest eine Bilddatei aus File-Input Event.
   * Validiert den Dateityp und gibt Base64-Daten-URL zurück.
   * @param {Event} event - Das File-Input Change-Event.
   * @returns {Promise<string | null>} Promise mit Base64-Daten-URL des Bildes oder null bei Fehler.
   */
  const readImageFile = (event: Event): Promise<string | null> => {
    return new Promise((resolve) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      
      if (!file || !file.type.startsWith('image/')) {
        resolve(null)
        return
      }

      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      fileReader.onerror = () => resolve(null)
      fileReader.readAsDataURL(file)
    })
  }

  // Räumt Kamera- und QR-Scanner-Ressourcen auf
  const cleanup = () => {
    stopQRCodeScanning()
    stopCamera()
  }

  return {
    videoElement,
    canvasElement,
    cameraStarted,
    showScanningLine,
    isScanning,
    startCamera,
    stopCamera,
    captureImage,
    startQRCodeScanning,
    stopQRCodeScanning,
    scanQRFromImage,
    readImageFile,
    cleanup
  }
}
