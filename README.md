# pixi-simple-gesture
Add Pinch, Pan, Tap gesture support to pixi.js sprites.

```
npm install --save pixi-simple-gesture
```

## Usage

### Pinch

```js
var gesture = require('pixi-simple-gesture')

var sprite = new PIXI.Sprite(texture)
var inertiaMode = true

gesture.pinchable(sprite, inertiaMode)

sprite.on('pinchstart', function() {
  console.log('pinch start')
})

sprite.on('pinchmove', function(event) {
  console.log('pinch move', event)
})

sprite.on('pinchend', function() {
  console.log('pinch end')
})
```

The 'pinchmove' handler receives an event object containing the following properties.

| Name    | Value                                 |
|:--------|:--------------------------------------|
| scale   | Scaling that has been done            |
| velocity| Velocity in px/ms                     |
| center  | Center position for multi-touch       |
| data    | Original InteractionData from pixi.js |

### Pan

```js
var gesture = require('pixi-simple-gesture')
var inertiaMode = true

var sprite = new PIXI.Sprite(texture)
gesture.panable(sprite, inertiaMode)

sprite.on('panstart', function() {
  console.log('pan start')
})

sprite.on('panmove', function(event) {
  console.log('pan move', event)
})

sprite.on('panend', function() {
  console.log('pan end')
})
```

The 'panmove' handler receives an event object containing the following properties.

| Name    | Value                                 |
|:--------|:--------------------------------------|
| deltaX  | Movement of the X axis                |
| deltaY  | Movement of the Y axis                |
| velocity| Velocity in px/ms                     |
| data    | Original InteractionData from pixi.js |

### Tap
```js
var gesture = require('pixi-simple-gesture')

var sprite = new PIXI.Sprite(texture)
gesture.tappable(sprite)

sprite.on('simpletap', function() {
  console.log('simply tapped')
})
```

NOT 'tap', **simpletap**. Because 'tap' is already used by pixi.js. This 'simpletap' works a bit better with 'pinch' and 'pan'.  The Handler receives an event object containing the following properties.

| Name    | Value                                 |
|:--------|:--------------------------------------|
| data    | Original InteractionData from pixi.js |


## Note

Any requests, issues, PRs are welcome!


### TODO

- Add Inertia Mode
- Add Complex? Tap, emits 'tapstart', 'tapcancel', 'tapend'. Could be useful to implement UI components which has active state style.
