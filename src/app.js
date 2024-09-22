import { tools } from './constants'
import { $$tools, $clear, $color, $lineWidth, $lineWidthDot, $lineJoinContainer, $$lineJoinBtn, $canvas, ctx } from './elements'
import { options, setTool, currentTool, startDrawing, drawing, stopDrawing, clearCanvas } from './utils'

// ----------------- tool events ----------------- //
$$tools.forEach(tool => {
  tool.addEventListener('click', (event) => {
    const $btn = event.target.closest('button')

    if (!$btn) return

    if ($btn.getAttribute('active') !== null) {
      $btn.removeAttribute('active')
      setTool(tools.none)
      $lineJoinContainer.classList.add('hidden')
      return
    } else {
      $$tools.forEach(tool => tool.removeAttribute('active'))
      $btn.setAttribute('active', '')
    }

    if ($btn.id === 'rectangle') $lineJoinContainer.classList.toggle('hidden')
    else $lineJoinContainer.classList.add('hidden')
    setTool($btn.id)
  })
})

$clear.addEventListener('click', clearCanvas)

$color.addEventListener('change', (event) => {
  options.color = event.target.value
  $lineWidth.style = `background-color: ${options.color};`
  $lineWidthDot.style = `background-color: ${options.color}; height: ${options.lineWidth * 0.9}px; width: ${options.lineWidth * 0.9}px;`
})

$lineWidth.addEventListener('input', (event) => {
  options.lineWidth = event.target.value
  $lineWidthDot.style = `height: ${options.lineWidth * 0.9}px; width: ${options.lineWidth * 0.9}px; background-color: ${options.color};`
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
$canvas.addEventListener('mousemove', (event) => {
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
