export default function pinchable (sprite) {
  function start (e) {
    e.target.on('touchmove', move)
  }

  function move (e) {
    let t = e.data.originalEvent.targetTouches
    if (!t || t.length < 2) {
      return
    }
    let dx = t[0].clientX - t[1].clientX
    let dy = t[0].clientY - t[1].clientY
    let distance = Math.sqrt(dx * dx + dy * dy)
    if (!e.target._pinch) {
      e.target._pinch = {
        p: { distance: distance, date: new Date() },
        pp: {}
      }
      e.target.emit('pinchstart')
      return
    }
    let center = {
      x: (t[0].clientX + t[1].clientX) / 2,
      y: (t[0].clientY + t[1].clientY) / 2
    }
    let now = new Date()
    let interval = now - e.target._pinch.p.date
    if (interval < 12) {
      return
    }
    let event = {
      scale: distance / e.target._pinch.p.distance,
      velocity: distance / interval,
      center: center,
      data: e.data
    }
    e.target.emit('pinchmove', event)
    e.target._pinch.pp = {
      distance: e.target._pinch.p.distance,
      date: e.target._pinch.p.date
    }
    e.target._pinch.p = {
      distance: distance,
      date: now
    }
  }

  // TODO: Inertia Mode
  function end (e) {
    if (e.target._pinch) {
      e.target.emit('pinchend')
    }
    e.target._pinch = null
    e.target.removeListener('touchmove', move)
  }

  sprite.interactive = true
  sprite
    .on('touchstart', start)
    .on('touchend', end)
    .on('touchendoutside', end)
}
