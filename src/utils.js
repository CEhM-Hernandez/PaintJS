import { tools, defaultOptions, globalCompositeOperation } from './constants.js'
import { $canvas, ctx, $color, $$tools } from './elements'

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

const options = { ...defaultOptions }

let isDrawing = false
let x0, y0
let lastX, lastY
let currentTool = tools.none
let ctxImageData

function setTool (tool, previousTool) {
  options.globalCompositeOperation = defaultOptions.globalCompositeOperation

  if (currentTool === tool) {
    currentTool = tools.none
    $$tools.forEach(tool => tool.removeAttribute('active'))
    return
  }
  $$tools.forEach(tool => tool.removeAttribute('active'))
  $(`#${tool}`).setAttribute('active', '')

  if (tool === tools.pencil) {
    currentTool = tools.pencil
    return
  } else if (tool === tools.eraser) {
    currentTool = tools.eraser
    options.globalCompositeOperation = globalCompositeOperation.destinationOut
    return
  } else if (tool === tools.rectangle) {
    currentTool = tools.rectangle
    return
  } else if (tool === tools.line) {
    currentTool = tools.line
    return
  } else if (tool === tools.elipsis) {
    currentTool = tools.elipsis
    return
  } else if (tool === tools.eyeDropper) {
    currentTool = tools.eyeDropper
    useEyeDropper(previousTool)
    return
  }
  currentTool = tools.none
}

function startDrawing (event) {
  isDrawing = currentTool !== tools.none
  const { offsetX, offsetY } = event;
  [lastX, lastY] = [x0, y0] = [offsetX, offsetY]
  ctx.globalCompositeOperation = options.globalCompositeOperation

  if (currentTool === tools.rectangle || currentTool === tools.line || currentTool === tools.elipsis) ctxImageData = ctx.getImageData(0, 0, $canvas.width, $canvas.height)
}

function drawing (event) {
  if (!isDrawing) return

  const { offsetX, offsetY } = event
  ctx.strokeStyle = options.color
  ctx.lineWidth = options.lineWidth

  if (currentTool === tools.pencil || currentTool === tools.eraser) {
    usePencil(offsetX, offsetY)
  }
  if (currentTool === tools.rectangle) {
    useRectangle(event.shiftKey, offsetX, offsetY)
  } else if (currentTool === tools.line) {
    useLine(offsetX, offsetY)
  } else if (currentTool === tools.elipsis) {
    useElipsis(event.shiftKey, offsetX, offsetY)
  }
}

function usePencil (offsetX, offsetY) {
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(offsetX, offsetY)
  ctx.stroke();

  [lastX, lastY] = [offsetX, offsetY]
}

function useRectangle (key, offsetX, offsetY) {
  const width = offsetX - x0
  const height = offsetY - y0
  ctx.putImageData(ctxImageData, 0, 0)

  if (key) {
    const { SymmetricWidth, SymmetricHeight } = calcSymmetricSize(width, height)

    ctx.beginPath()
    ctx.strokeRect(x0, y0, SymmetricWidth, SymmetricHeight)
  } else {
    ctx.beginPath()
    ctx.strokeRect(x0, y0, width, height)
  }
}

function useElipsis (key, offsetX, offsetY) {
  const width = offsetX - x0
  const height = offsetY - y0
  ctx.putImageData(ctxImageData, 0, 0)

  if (key) {
    const { SymmetricWidth, SymmetricHeight } = calcSymmetricSize(width, height)
    ctx.beginPath()
    ctx.ellipse(x0, y0, Math.abs(SymmetricWidth), Math.abs(SymmetricHeight), 0, 0, 2 * Math.PI)
  } else {
    ctx.beginPath()
    ctx.ellipse(x0, y0, Math.abs(width), Math.abs(height), 0, 0, 2 * Math.PI)
  }
  ctx.stroke()
}

function useLine (offsetX, offsetY) {
  ctx.putImageData(ctxImageData, 0, 0)
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(offsetX, offsetY)
  ctx.stroke()
}

function calcSymmetricSize (width, height) {
  const size = Math.min(Math.abs(width), Math.abs(height))
  width = width < 0 ? -size : size
  width = height < 0 ? -size : size
  return { SymmetricWidth: width, SymmetricHeight: height }
}

async function useEyeDropper (previousTool) {
  const eyeDropper = new window.EyeDropper()

  try {
    const result = await eyeDropper.open()
    const { sRGBHex: color } = result
    options.color = color
    $color.value = color
    setTool(previousTool, currentTool)
  } catch (e) {
    console.error(e)
  }
}

function stopDrawing (event) {
  isDrawing = false
  ctx.closePath()
}

function clearCanvas () {
  ctx.clearRect(0, 0, $canvas.width, $canvas.height)
}

export { $, $$, setTool, startDrawing, drawing, stopDrawing, clearCanvas, options, currentTool }
