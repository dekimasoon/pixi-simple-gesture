export default function tappable (sprite) {
  function mouseDown (e) {
    start(e, e.data.originalEvent)
  }

  function touchStart (e) {
    start(e, e.data.originalEvent.targetTouches[0])
  }

  // possibly be called twice or more
  function start (e, t) {
    if (e.target._tap) {
      return
    }
    e.target._tap = {
      p: {
        x: t.clientX,
        y: t.clientY
      }
    }
    e.target
      .on('mousemove', mouseMove)
      .on('touchmove', touchMove)
  }

  function mouseMove (e) {
    move(e, e.data.originalEvent)
  }

  function touchMove (e) {
    let t = e.data.originalEvent.targetTouches
    if (!t || t.length > 1) {
      e.target._tap.canceled = true
      end(e)
      return
    }
    move(e, t[0])
  }

  function move (e, t) {
    let dx = t.clientX - e.target._tap.p.x
    let dy = t.clientY - e.target._tap.p.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    let threshold = (t instanceof window.MouseEvent) ? 2 : 7
    if (distance > threshold) {
      e.target._tap.canceled = true
    }
  }

  // possibly be called twice or more
  function end (e) {
    if (e.target._tap && !e.target._tap.canceled) {
      let event = {
        data: e.data
      }
      e.target.emit('simpletap', event)
    }
    e.target._tap = null
    e.target
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
