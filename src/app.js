import { tools } from './constants'
import { $clear, $color, $$tools, $lineWidth, $lineJoinContainer, $eyeDropper, $lineWidthDot, $$lineJoinBtn, $canvas, ctx } from './elements'
import { options, currentTool, setTool, startDrawing, drawing, stopDrawing, clearCanvas } from './utils'

// ----------------- tool events ----------------- //
$$tools.forEach(tool => {
  tool.addEventListener('click', (event) => {
    const $btn = event.target.closest('button')

    if (!$btn) return

    if ($btn.getAttribute('active') !== null) {
      setTool(tools.none)
      $lineJoinContainer.classList.add('hidden')
      return
    }

    if ($btn.id === 'rectangle') $lineJoinContainer.classList.toggle('hidden')
    else $lineJoinContainer.classList.add('hidden')
    setTool($btn.id, currentTool)
  })
})

if (typeof window.EyeDropper !== 'undefined') $eyeDropper.removeAttribute('disabled')

$clear.addEventListener('click', clearCanvas)

$color.addEventListener('change', (event) => {
  options.color = event.target.value
})

$lineWidth.addEventListener('input', (event) => {
  options.lineWidth = event.target.value
  $lineWidthDot.style = `height: ${options.lineWidth * 0.9}px; width: ${options.lineWidth * 0.9}px;`
})

$$lineJoinBtn.forEach(lineJoin => {
  lineJoin.addEventListener('click', (event) => {
    const $btn = event.target.closest('button')

    if (!$btn) return

    $$lineJoinBtn.forEach(btn => btn.removeAttribute('active'))
    $btn.setAttribute('active', '')

    ctx.lineJoin = $btn.value
  })
})

// ----------------- draw events ----------------- //
$canvas.addEventListener('mousedown', startDrawing)
$canvas.addEventListener('mousemove', drawing)
$canvas.addEventListener('mouseup', stopDrawing)
$canvas.addEventListener('mouseleave', stopDrawing)

// ----------------- cursor events ----------------- //
$canvas.addEventListener('mousemove', () => {
  if (currentTool === tools.pencil || currentTool === tools.eraser) {
    $canvas.style.cursor = 'none'
    const cursorSize = (options.lineWidth * 0.9) <= 10 ? 10 : options.lineWidth * 0.9
    const cursorCanvas = document.createElement('canvas')
    const cursorCtx = cursorCanvas.getContext('2d')

    cursorCanvas.width = cursorSize
    cursorCanvas.height = cursorSize

    const x0 = cursorSize / 2
    const y0 = cursorSize / 2
    const radius = (cursorSize / 2) - 1

    cursorCtx.beginPath()
    cursorCtx.arc(x0, y0, radius, 0, Math.PI * 2)
    cursorCtx.stroke()

    const cursorDataURL = cursorCanvas.toDataURL()
    $canvas.style.cursor = `url(${cursorDataURL}) ${cursorSize / 2} ${cursorSize / 2}, auto`
    return
  } else if (currentTool === tools.rectangle || currentTool === tools.line || currentTool === tools.elipsis) {
    $canvas.style.cursor = 'crosshair'
    return
  }
  $canvas.style.cursor = 'default'
})
