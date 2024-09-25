const tools = {
  none: 'none',
  pencil: 'pencil',
  eraser: 'eraser',
  line: 'line',
  rectangle: 'rectangle',
  elipsis: 'elipsis',
  eyeDropper: 'eyeDropper'
}

const globalCompositeOperation = {
  sourceOver: 'source-over',
  destinationOut: 'destination-out'
}

const defaultOptions = {
  backgroundColor: 'white',
  color: 'black',
  lineWidth: 2,
  fontSize: 16,
  fontFamily: 'Arial',
  cursor: 'default',
  globalCompositeOperation: globalCompositeOperation.sourceOver,
  lineJoin: 'round'
}

export { tools, globalCompositeOperation, defaultOptions }
