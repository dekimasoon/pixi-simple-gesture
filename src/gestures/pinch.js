/**
 * 渡されたspriteをPinchに対応させる(Touchのみ。Wheelイベントには非対応)
 * 適切なタイミングでonPinchStart, onPinchMove, onPinchEndのそれぞれを
 * 呼び出すように設定する
 * spriteにはonPinchMoveが必ず設定されている必要がある
 * @param sprite
 */
export default function pinchable (sprite) {
  /**
   * タッチの開始時に呼ばれる
   * @param e
   */
  function start (e) {
    e.target.on('touchmove', move)
  }

  /**
   * タッチの移動中に呼ばれる。Pinch動作か判断し必要であれば各ハンドラを呼ぶ
   *
   * 1. マルチタッチである
   * 2. 初回ではない
   * 3. 12ms以上経過している
   * 以上を満たしている場合、scaleとvelocityを計算しonPinchMoveに渡す
   * 上記2値の計算に必要な値（distanceとdate）は前回、前々回分を
   * target._pinch.p/ppに保管し次回以降の計算に利用する
   * また初回の場合は、onPinchStartを呼ぶ
   * @param e
   */
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
      if (typeof e.target.onPinchStart === 'function') {
        e.target.onPinchStart()
      }
      return
    }
    let now = new Date()
    let interval = now - e.target._pinch.p.date
    if (interval < 12) {
      return
    }
    let event = {
      scale: distance / e.target._pinch.p.distance,
      velocity: distance / interval,
      data: e.data
    }
    e.target.onPinchMove(event)
    e.target._pinch.pp.distance = e.target._pinch.p.distance
    e.target._pinch.pp.date = e.target._pinch.p.date
    e.target._pinch.p = { distance: distance, date: now }
  }

  /**
   * タッチの終了時に呼ばれる
   *
   * TODO:
   * target._pinch.p/ppを用いてvelocityを計算する。
   * velocityが閾値以上だった場合は慣性スクロール用の処理を行う
   * 上記のあとonPinchEndを呼ぶ。
   * @param e
   */
  function end (e) {
    if (e.target._pinch && typeof e.target.onPinchEnd === 'function') {
      e.target.onPinchEnd()
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
