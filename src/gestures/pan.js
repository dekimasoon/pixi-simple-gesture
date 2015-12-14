export default function panable (sprite) {
  function start (e) {
    if (e.target._pan) {
      return
    }
    e.target._pan = {}
    e.target._pan.timer = setTimeout(() => {
      e.target.emit('panstart')
      e.target._pan.isPanning = true
    }, 60)
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

  function move (e, c) {
    if (!e.target._pan.isPanning) {
      return
    }
    if (!e.target._pan.p) {
      e.target._pan.p = { x: c.clientX, y: c.clientY, date: new Date() }
      e.target._pan.pp = {}
      return
    }
    let now = new Date()
    let interval = now - e.target._pan.p.date
    if (interval < 12) {
      return
    }
    let dx = c.clientX - e.target._pan.p.x
    let dy = c.clientY - e.target._pan.p.y
    let distance = Math.sqrt(dx * dx + dy * dy)
    let event = {
      deltaX: dx,
      deltaY: dy,
      velocity: distance / interval,
      data: e.data
    }
    e.target.emit('panmove', event)
    e.target._pan.pp.x = e.target._pan.p.x
    e.target._pan.pp.y = e.target._pan.p.y
    e.target._pan.pp.date = e.target._pan.p.date
    e.target._pan.p = { x: c.clientX, y: c.clientY, date: now }
  }

  // TODO: Inertia Mode
  function end (e) {
    if (!e.target._pan) {
      return
    }
    if (e.target._pan.isPanning) {
      e.target.emit('panend')
    } else {
      clearTimeout(e.target._pan.timer)
    }
    e.target._pan = null
    e.target
      .removeListener('mousemove', mouseMove)
      .removeListener('touchmove', touchMove)
  }

  sprite.interactive = true
  sprite
    .on('mousedown', start)
    .on('touchstart', start)
    .on('mouseup', end)
    .on('mouseupoutside', end)
    .on('touchend', end)
    .on('touchendoutside', end)
}
