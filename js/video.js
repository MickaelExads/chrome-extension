let videoBlob = null // Variable to store the video Blob
let generating = false // Track if the video is being generated
const generateVideoForm = document.getElementById('generate-video')

generateVideoForm.addEventListener('submit', function (event) {
    event.preventDefault()
    generateVideo()
})
document.getElementById('video-download').addEventListener('click', downloadVideo)
document.getElementById('video-open-tab').addEventListener('click', openVideoInNewTab)
function generateVideo() {
    if (generating) return // Prevent generating multiple videos at once

    generating = true

    const button = document.getElementById("generate-video-button")
    button.disabled = true // Disable button while generating
    button.innerText = "Generating..."
    
    // Create and show progress bar
    const progressContainer = document.createElement('div')
    progressContainer.className = 'progress mt-2'
    progressContainer.style.height = '20px'
    
    const progressBar = document.createElement('div')
    progressBar.className = 'progress-bar progress-bar-striped progress-bar-animated bg-info'
    progressBar.setAttribute('role', 'progressbar')
    progressBar.style.width = '0%'
    progressBar.textContent = '0%'
    
    progressContainer.appendChild(progressBar)
    button.parentNode.appendChild(progressContainer)
    
    // Hide video panel
    const dummy = document.getElementById("video-panel")
    dummy.classList.add('d-none')
    dummy.classList.remove('d-flex')

    const width = parseInt(document.getElementById("video-width").value)
    const height = parseInt(document.getElementById("video-height").value)
    const text = document.getElementById("video-text").value
    const color = document.getElementById("video-color").value
    const duration = parseInt(document.getElementById("video-duration").value) + 1

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")

    const stream = canvas.captureStream(30) // 30 FPS
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" })
    const chunks = []

    recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            chunks.push(event.data)
        }
    }

    recorder.onstop = () => {
        videoBlob = new Blob(chunks, { type: "video/webm" })
        const videoURL = URL.createObjectURL(videoBlob)
        const video = document.getElementById("dummy-video")
        video.src = videoURL

        const button = document.getElementById("generate-video-button")
        button.disabled = false // Enable button
        button.innerText = "Generate"
        
        // Remove progress bar
        const progressContainer = button.parentNode.querySelector('.progress')
        if (progressContainer) {
            progressContainer.remove()
        }
        
        // Show video panel
        const dummy = document.getElementById("video-panel")
        dummy.classList.remove('d-none')
        dummy.classList.add('d-flex')

        generating = false
    }

    recorder.start()

    let startTime = null
    let textY = height / 2 // Start vertical position for animation
    let frame = 0
    const totalFrames = duration * 30 // 30 FPS

    function drawFrame(timestamp) {
        if (!startTime) startTime = timestamp

        const elapsed = (timestamp - startTime) / 1000

        if (elapsed >= duration) {
            recorder.stop()
            return
        }

        // Update progress bar
        const progress = (elapsed / duration) * 100
        const progressBar = document.querySelector('.progress-bar')
        if (progressBar) {
            progressBar.style.width = progress + '%'
            progressBar.textContent = Math.round(progress) + '%'
        }

        // Simple text animation: change Y position over time
        textY = height / 2 + Math.sin(frame * 0.1) * 4 // Bouncing text animation. Rise this last number to increse animation

        ctx.fillStyle = color
        ctx.fillRect(0, 0, width, height)

        ctx.fillStyle = "black"
        ctx.font = parseInt(height/10 + height/100) + "px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(text, width / 2, textY)

        frame++
        requestAnimationFrame(drawFrame)
    }

    requestAnimationFrame(drawFrame)
}

function downloadVideo() {
    if (!videoBlob) {
        return
    }

    const downloadLink = document.createElement("a")
    downloadLink.href = URL.createObjectURL(videoBlob)
    downloadLink.download = "dummy_video.webm" // Specify the filename
    downloadLink.click()
}

function openVideoInNewTab() {
    if (!videoBlob) {
        return
    }

    const videoURL = URL.createObjectURL(videoBlob)

    // Create a new window and inject HTML to display the video
    const newTab = window.open('', '_blank')
    if (newTab) {
        newTab.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Generated Video</title>
            </head>
            <body style="margin: 0 display: flex justify-content: center align-items: center height: 100vh background-color: #696969">
                <video controls autoplay style="max-width: 100% max-height: 100%">
                    <source src="${videoURL}" type="video/webm">
                    Your browser does not support the video tag.
                </video>
            </body>
            </html>
        `)
        newTab.document.close() // Ensure the document is fully loaded in the new tab
    } else {
        alert("Unable to open the new tab. Please allow popups for this website.")
    }
}

