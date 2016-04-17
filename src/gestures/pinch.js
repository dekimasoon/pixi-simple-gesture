export default function pinchable (sprite, inertia) {

  function start (e) {
    sprite.on('touchmove', move)
  }

  function move (e) {
    let t = e.data.originalEvent.targetTouches
    if (!t || t.length < 2) {
      return
    }
    let dx = t[0].clientX - t[1].clientX
    let dy = t[0].clientY - t[1].clientY
    let distance = Math.sqrt(dx * dx + dy * dy)
    if (!sprite._pinch) {
      sprite._pinch = {
        p: {
          distance: distance,
          date: new Date()
        }
      }
      sprite.emit('pinchstart')
      return
    }
    let now = new Date()
    let interval = now - sprite._pinch.p.date
    if (interval < 12) {
      return
    }
    let center = {
      x: (t[0].clientX + t[1].clientX) / 2,
      y: (t[0].clientY + t[1].clientY) / 2
    }
    let event = {
      scale: distance / sprite._pinch.p.distance,
      velocity: distance / interval,
      center: center,
      data: e.data
    }
    sprite.emit('pinchmove', event)
    sprite._pinch.pp = {
      distance: sprite._pinch.p.distance,
      date: sprite._pinch.p.date
    }
    sprite._pinch.p = {
      distance: distance,
      date: now
    }
  }

  function end (e) {
    sprite.removeListener('touchmove', move)
    if (!sprite._pinch) {
      return
    }
    if (inertia && sprite._pinch.pp) {
      if (sprite._pinch.intervalId) {
        return
      }
      let interval = new Date() - sprite._pinch.p.date
      let velocity = (sprite._pinch.p.distance - sprite._pinch.pp.distance) / interval
      let center = sprite._pinch.p.center
      let distance = sprite._pinch.p.distance
      sprite._pinch.intervalId = setInterval(() => {
        if (Math.abs(velocity) < 0.04) {
          clearInterval(sprite._pinch.intervalId)
          sprite.emit('pinchend')
          sprite._pinch = null
          return
        }
        let updatedDistance = distance + velocity * 12
        let event = {
          scale: updatedDistance / distance,
          velocity: velocity,
          center: center,
          data: e.data
        }
        sprite.emit('pinchmove', event)
        distance = updatedDistance
        velocity *= 0.8
      }, 12)
    } else {
      sprite.emit('pinchend')
      sprite._pinch = null
    }
  }

  sprite.interactive = true
  sprite
    .on('touchstart', start)
    .on('touchend', end)
    .on('touchendoutside', end)
}
