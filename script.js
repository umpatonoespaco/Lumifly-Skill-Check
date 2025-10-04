const cursor = document.getElementById('cursor')
const perfectZone = document.getElementById('perfect-zone')
const leftPartialZone = document.getElementById('left-partial-zone')
const rightPartialZone = document.getElementById('right-partial-zone')
const attackBox = document.getElementById('attack-box')
const usernameInput = document.getElementById('username')

let animationFrame
let startTime
let running = true
let duration = 1000
let hasStarted = false

  randomizeHitZones()


function sendToDiscord(accuracy) {
  
  const webhook = 'https://discord.com/api/webhooks/1423829049389613066/1vOvBIQ7DwvoLAMNnrCp8qdOrxMuxoONljebSb2nIo05x3NGQBcvXbLaVoFhkQLXDNv7'

  const payload = {
    content: `${usernameInput.value} acertou um ${accuracy}`
  }
  fetch(webhook, {
    method: 'POST',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  .then(response => {
    if (response.ok) {
      console.log('Mensagem enviada')
    }
    else {
      console.log('Mensagem não enviada')
    }
  })
  .catch(error => {
    console.error('Erro:', error)
    console.log('Erro ao mandar mensagem')
  })
}



function animateCursor(timestamp) {
  if (!startTime) startTime = timestamp
  const elapsed = timestamp - startTime

  const progress = Math.min(elapsed / duration, 1)
  const boxWidth = attackBox.clientWidth
  const cursorX = progress * boxWidth

  cursor.style.left = `${cursorX}px`

  if (progress < 1 && running) {
    animationFrame = requestAnimationFrame(animateCursor)
  } else {
    stopCursor()
  }
}

function stopCursor() {
  cancelAnimationFrame(animationFrame)
  running = false

  const cursorRect = cursor.getBoundingClientRect()
  const perfectRect = perfectZone.getBoundingClientRect()
  const leftPartialRect = leftPartialZone.getBoundingClientRect()
  const rightPartialRect = rightPartialZone.getBoundingClientRect()

  const isOverlap = (rect1, rect2) => {
    return (
      rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top
    )
  }

  if (isOverlap(cursorRect, perfectRect)) {
    onPerfectHit()
  } else if (
    isOverlap(cursorRect, leftPartialRect) ||
    isOverlap(cursorRect, rightPartialRect)
  ) {
    onPartialHit()
  } else {
    onMiss()
  }
}


function onPerfectHit() {
  sendToDiscord('Perfeito')
  alert("Acerto Perfeito!")
  location.reload()
}

function onPartialHit() {
  sendToDiscord('Parcial')
  alert("Acerto Parcial!")
  location.reload()
}

function onMiss() {
  sendToDiscord('Erro')
  alert("Erro completo!")
  location.reload()
}
function randomizeHitZones() {
  const attackWidth = attackBox.clientWidth

  const perfectWidth = 40
  const partialWidth = 30
  const totalHitZoneWidth = partialWidth + perfectWidth + partialWidth

  
  const minX = 100
  const maxX = attackWidth - totalHitZoneWidth

  const baseX = Math.floor(Math.random() * (maxX - minX + 1)) + minX


  leftPartialZone.style.left = `${baseX}px`
  perfectZone.style.left = `${baseX + partialWidth}px`
  rightPartialZone.style.left = `${baseX + partialWidth + perfectWidth}px`
}

function reset() {
  running = true
  startTime = null
  
  randomizeHitZones()
  requestAnimationFrame(animateCursor)
}



document.addEventListener('click', () => {

  if (event.target === usernameInput) return

  if (!hasStarted) {
    hasStarted = true
    running = true
    startTime = null

    requestAnimationFrame(animateCursor)
  } else if (running) {
    stopCursor()
  }
})






