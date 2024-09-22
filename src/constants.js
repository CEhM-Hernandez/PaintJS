// ----------------- constants ----------------- //

const tools = {
  none: 'none',
  pencil: 'pencil',
  eraser: 'eraser',
  line: 'line',
  rectangle: 'rectangle',
  elipsis: 'elipsis',
  text: 'text'
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
  globalCompositeOperation: globalCompositeOperation.sourceOver
}

export { tools, globalCompositeOperation, defaultOptions }
