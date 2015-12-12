/**
 * 渡されたspriteをPanに対応させる(Click, Touchの両方に対応)
 * 適切なタイミングでonPanStart, onPanMove, onPanEndのそれぞれを呼び出す
 * spriteにはonPanMoveが必ず設定されている必要がある
 * @param sprite
 */
export default function panable (sprite) {
  /**
   * クリック/タッチの開始時に呼ばれる
   * @param e
   */
  function start (e) {
    e.target
      .on('mousemove', mouseMove)
      .on('touchmove', touchMove)
  }

  /**
   * クリックの移動中に呼ばれる
   * @param e
   */
  function mouseMove (e) {
    move(e, e.data.originalEvent)
  }

  /**
   * タッチの移動中に呼ばれる
   *
   * シングルタッチかどうか判断する
   * @param e
   */
  function touchMove (e) {
    let t = e.data.originalEvent.targetTouches
    if (!t || t.length > 1) {
      return
    }
    move(e, t[0])
  }

  /**
   * クリック/タッチの移動中に呼ばれる。Pan動作か判断し必要であれば各ハンドラを呼ぶ
   *
   * 1. 初回ではない
   * 2. 12ms以上経過している
   * 以上を満たしている場合deltaX,deltaY,velocityを計算しonTapMoveに渡す
   * 上記3値の計算に必要な値（x,y,date）は初回と前回分を
   * target._pan.p/ppに保管し次回以降の計算に利用する
   * また初回の場合は、onPanStartを呼ぶ
   * @param e
   * @param c
   */
  function move (e, c) {
    if (!e.target._pan) {
      e.target._pan = {
        p: { x: c.clientX, y: c.clientY, date: new Date() },
        pp: {}
      }
      if (typeof e.target.onPanStart === 'function') {
        e.target.onPanStart()
      }
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
    e.target.onPanMove(event)
    e.target._pan.pp.x = e.target._pan.p.x
    e.target._pan.pp.y = e.target._pan.p.y
    e.target._pan.pp.date = e.target._pan.p.date
    e.target._pan.p = { x: c.clientX, y: c.clientY, date: now }
  }

  /**
   * クリック、タッチの終了時に呼ばれる
   *
   * TODO:
   * target._pan.p/ppを用いてvelocityを計算する。
   * velocityが閾値以上だった場合は慣性スクロール用の処理を行う
   * 上記のあとonPanEndを呼ぶ。
   * @param e
   */
  function end (e) {
    if (e.target._pan && typeof e.target.onPanEnd === 'function') {
      e.target.onPanEnd()
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
