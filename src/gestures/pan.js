export default function panable (sprite) {
  function mouseDown (e) {
    start(e, e.data.originalEvent)
  }

  function touchStart (e) {
    start(e, e.data.originalEvent.targetTouches[0])
  }

  // possibly be called twice or more
  function start (e, t) {
    if (e.target._pan) {
      return
    }
    e.target._pan = {
      p: {
        x: t.clientX,
        y: t.clientY,
        date: new Date()
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
      end(e)
      return
    }
    move(e, t[0])
  }

  function move (e, t) {
    let now = new Date()
    let interval = now - e.target._pan.p.date
    if (interval < 12) {
      return
    }
    let dx = t.clientX - e.target._pan.p.x
    let dy = t.clientY - e.target._pan.p.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    if (!e.target._pan.pp) {
      let threshold = (t instanceof window.MouseEvent) ? 2 : 7
      if (distance > threshold) {
        e.target.emit('panstart')
        e.target._pan.pp = {}
      }
      return
    }
    let event = {
      deltaX: dx,
      deltaY: dy,
      velocity: distance / interval,
      data: e.data
    }
    e.target.emit('panmove', event)
    e.target._pan.pp = {
      x: e.target._pan.p.x,
      y: e.target._pan.p.y,
      date: e.target._pan.p.date
    }
    e.target._pan.p = {
      x: t.clientX,
      y: t.clientY,
      date: now
    }
  }

  // TODO: Inertia Mode
  // possibly be called twice or more
  function end (e) {
    if (e.target._pan && e.target._pan.pp) {
      e.target.emit('panend')
    }
    e.target._pan = null
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
