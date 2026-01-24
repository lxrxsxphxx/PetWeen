import { ref } from 'vue'

type QRCallback = (data: string) => void

/**
 * useCamera (frontend-only)
 *
 * Small helper for:
 * - starting/stopping the browser camera preview
 * - capturing a frame as data URL
 * - decoding QR codes via the built-in BarcodeDetector (if available)
 */
export function useCamera() {
  const videoElement = ref<HTMLVideoElement | null>(null)
  const canvasElement = ref<HTMLCanvasElement | null>(null)

  const cameraStarted = ref(false)
  const showScanningLine = ref(false)
  const isScanning = ref(false)

  let stream: MediaStream | null = null
  let rafId: number | null = null

  const createDetector = () => {
    const Ctor = (window as any).BarcodeDetector
    if (!Ctor) return null
    try {
      // Some browsers require formats.
      return new Ctor({ formats: ['qr_code'] })
    } catch {
      return null
    }
  }

  const detector = createDetector()

  const ensureCanvas = () => {
    if (!canvasElement.value) canvasElement.value = document.createElement('canvas')
    return canvasElement.value
  }

  async function startCamera(onReady?: () => void, enableScanningLine: boolean = false) {
    if (cameraStarted.value) return

    showScanningLine.value = enableScanningLine

    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    })

    const video = videoElement.value
    if (video) {
      video.srcObject = stream
      // play() can fail on some browsers until the user interacts with the page.
      await video.play().catch(() => {})
    }

    cameraStarted.value = true
    onReady?.()
  }

  function stopCamera() {
    cameraStarted.value = false

    const video = videoElement.value
    if (video) video.srcObject = null

    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      stream = null
    }
  }

  function captureImage(): string | null {
    const video = videoElement.value
    if (!video) return null

    const width = video.videoWidth
    const height = video.videoHeight
    if (!width || !height) return null

    const canvas = ensureCanvas()
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(video, 0, 0, width, height)
    return canvas.toDataURL('image/jpeg', 0.9)
  }

  function startQRCodeScanning(onDetect: QRCallback) {
    if (!detector) return
    if (isScanning.value) return

    isScanning.value = true

    const loop = async () => {
      if (!isScanning.value) return

      const video = videoElement.value
      if (!video || video.readyState < 2) {
        rafId = window.requestAnimationFrame(loop)
        return
      }

      const canvas = ensureCanvas()
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480

      const ctx = canvas.getContext('2d')
      if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      try {
        const codes = await detector.detect(canvas)
        const value = codes?.[0]?.rawValue
        if (value) {
          onDetect(value)
          stopQRCodeScanning()
          return
        }
      } catch {
        // Ignore scanning errors and keep trying.
      }

      rafId = window.requestAnimationFrame(loop)
    }

    rafId = window.requestAnimationFrame(loop)
  }

  function stopQRCodeScanning() {
    isScanning.value = false
    showScanningLine.value = false

    if (rafId != null) {
      window.cancelAnimationFrame(rafId)
      rafId = null
    }
  }

  async function scanQRFromImage(imageUrl: string): Promise<string | null> {
    if (!detector) return null

    const img = new Image()
    img.crossOrigin = 'anonymous'

    const loaded = new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Image load failed'))
    })

    img.src = imageUrl
    await loaded

    const canvas = ensureCanvas()
    canvas.width = img.naturalWidth || img.width
    canvas.height = img.naturalHeight || img.height

    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(img, 0, 0)

    try {
      const codes = await detector.detect(canvas)
      return codes?.[0]?.rawValue || null
    } catch {
      return null
    }
  }

  function readImageFile(event: Event): Promise<string | null> {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return Promise.resolve(null)
    if (!file.type.startsWith('image/')) return Promise.resolve(null)

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(file)
    })
  }

  function cleanup() {
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
    cleanup,
  }
}
