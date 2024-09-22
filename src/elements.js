import { $, $$ } from './utils'

// ----------------- tools ----------------- //
const $$tools = $$('.tool')

const $clear = $('#clear')
const $color = $('#color')
const $lineWidth = $('#lineWidth')
const $lineWidthDot = $('.lineWidthDot')
const $lineJoinContainer = $('#lineJoin-container')
const $$lineJoinBtn = $$('.lineJoinBtn')
const $eyeDropper = $('#eyeDropper')

// ----------------- canvas element ----------------- //
const $canvas = $('#paintCanvas')
const ctx = $canvas.getContext('2d', { willReadFrequently: true })
$canvas.style = 'background-color: #fff;'
ctx.lineCap = 'round'

export { $$tools, $clear, $color, $lineWidth, $eyeDropper, $lineWidthDot, $lineJoinContainer, $$lineJoinBtn, $canvas, ctx }
