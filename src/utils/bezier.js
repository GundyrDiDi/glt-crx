// 二阶
export default (points, num) => {
  const [[x1, y1], [x2, y2], [x3, y3]] = points
  const res = []
  for (let i = 1; i <= num; i++) {
    //
    const xa = x1 + (x2 - x1) * i / num
    const ya = y1 + (y2 - y1) * i / num
    //
    const xb = x2 + (x3 - x2) * i / num
    const yb = y2 + (y3 - y2) * i / num
    //
    const xc = xa + (xb - xa) * i / num
    const yc = ya + (yb - ya) * i / num
    //
    res.push([xc, yc])
  }
  return res
}

// 多阶 递归
