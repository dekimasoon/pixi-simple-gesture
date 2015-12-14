# pixi-simple-gesture
Add Pinch, Pan gesture support to pixi.js sprites.

```
npm install --save pixi-simple-gesture
```

## Usage

### Pinch

```js
var gesture = require('pixi-simple-gesture')

var sprite = new PIXI.Sprite(texture)
gesture.pinchable(sprite)

sprite.on('pinchstart', function() {
  console.log('pi nch start')
})

sprite.on('pinchmove', function(event) {
  console.log('pinch move', event)
})

sprite.on('pinchend', function() {
  console.log('pinch end')
})
```

The 'pinchmove' handler receives an event object containing the following properties.

| Name    | Value                          |
|:--------|:-------------------------------|
| scale   | Scaling that has been done     |
| velocity| Velocity in px/ms              |
| center  | Center position for multi-touch|

### Pan

```js
var gesture = require('pixi-simple-gesture')

var sprite = new PIXI.Sprite(texture)
gesture.panable(sprite)

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

| Name    | Value                          |
|:--------|:-------------------------------|
| deltaX  | Movement of the X axis         |
| deltaY  | Movement of the Y axis         |
| velocity| Velocity in px/ms              |


### TODO

- Add Inertia Mode