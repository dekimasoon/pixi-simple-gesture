export default function tappable (sprite) {
  function mouseDown (e) {
    start(e, e.data.originalEvent)
  }

  function touchStart (e) {
    start(e, e.data.originalEvent.targetTouches[0])
  }

  // possibly be called twice or more
  function start (e, t) {
    if (sprite._tap) {
      return
    }
    sprite._tap = {
      p: {
        x: t.clientX,
        y: t.clientY
      }
    }
    sprite
      .on('mousemove', mouseMove)
      .on('touchmove', touchMove)
  }

  function mouseMove (e) {
    move(e, e.data.originalEvent)
  }

  function touchMove (e) {
    let t = e.data.originalEvent.targetTouches
    if (!t || t.length > 1) {
      sprite._tap.canceled = true
      end(e)
      return
    }
    move(e, t[0])
  }

  function move (e, t) {
    let dx = t.clientX - sprite._tap.p.x
    let dy = t.clientY - sprite._tap.p.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    let threshold = (t instanceof window.MouseEvent) ? 2 : 7
    if (distance > threshold) {
      sprite._tap.canceled = true
    }
  }

  // possibly be called twice or more
  function end (e) {
    if (sprite._tap && !sprite._tap.canceled) {
      let event = {
        data: e.data
      }
      sprite.emit('simpletap', event)
    }
    sprite._tap = null
    sprite
      .removeListener('mousemove', mouseMove)
      .removeListener('touchmove', touchMove)
  }

  sprite.interactive = true
  sprite
    .on('mousedown', mouseDown)
    .on('touchstart', touchStart)
    .on('mouseup', end)
    .on('mouseupoutside', end)
    .on('touchend', end)
    .on('touchendoutside', end)
}
