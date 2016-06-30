import gesture from '../src'
import PIXI from 'pixi.js'

let rendererOpts = {
  backgroundColor: 0x6482C0
}

let width = window.innerWidth
let height = window.innerHeight
let renderer = PIXI.autoDetectRenderer(width, height, rendererOpts)
document.querySelector('body').appendChild(renderer.view)

let sprite = PIXI.Sprite.fromImage('./ninja@3x.png')
gesture.panable(sprite, true)
gesture.pinchable(sprite, true)
gesture.tappable(sprite, true)

sprite.on('panmove', e => {
  sprite.x += e.deltaX
  sprite.y += e.deltaY
})

sprite.on('panstart', () => {
  console.log('panstart')
})

sprite.on('panend', () => {
  console.log('panend')
})

sprite.on('pinchmove', e => {
  sprite.scale.x = Math.max(0.5, sprite.scale.x * e.scale)
  sprite.scale.y = Math.max(0.5, sprite.scale.y * e.scale)
})

sprite.on('pinchstart', () => {
  console.log('pinchstart')
})

sprite.on('pinchend', () => {
  console.log('pinchend')
})

sprite.on('simpletap', () => {
  console.log('simpletap')
})

let interval = 1000 / 60   // 60fps
let stage = new PIXI.Container()
stage.addChild(sprite)
function startAnimate () {
  let then = Date.now()
  function animate () {
    requestAnimationFrame(animate)
    let now = Date.now()
    let elapsed = now - then
    if (elapsed > interval) {
      then = now
      renderer.render(stage)
    }
  }
  animate()
}
startAnimate()
