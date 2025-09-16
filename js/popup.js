const generateImageForm = document.getElementById('generate-image')
const urlDisplay = document.getElementById('url-display')

function generateUrl() {
  const textColor = 'black'
  const width = document.getElementById('width').value
  const height = document.getElementById('height').value || width
  const format = `${document.getElementById('format').value}`
  const bgColor = document.getElementById('bg-color').value.slice(1)
  let displayText = document.getElementById('display-text').value.replace(/ /g, '+')
  displayText = !displayText ? '' : `?text=${displayText}`

  let url = `https://placehold.co/${width}x${height}/${bgColor}/${textColor}/${format}${displayText}`
  document.getElementById('image-generated').src = url
  return url
}

function openUrl(url) {
  const btn = document.getElementById('open-url')
  btn.href = url
}

function copyUrl() {
  urlDisplay.select()
  document.execCommand("copy");
}

function showUrlPanel(url) {
  const panel = document.getElementById('url-panel')
  const copyBtn = document.getElementById('copy-url')
  // Enable open URL button
  openUrl(url)
  // Enable copy URL button
  copyBtn.addEventListener('click', copyUrl)
  // Show URL
  urlDisplay.value = url
  // Show URL Panel
  panel.classList.remove('d-none')
  panel.classList.add('d-flex')
}

generateImageForm.addEventListener('submit', function (event) {
  event.preventDefault()
  const url = generateUrl()
  showUrlPanel(url)
})
