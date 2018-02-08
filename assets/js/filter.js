//时间过滤器
export const time = function (opt) {
  opt = opt.replace(/-/g, '/')
  opt = new Date(opt)
  let now = new Date()
  opt = Math.floor((now.getTime() - opt.getTime()) / (1000 * 60 * 60 * 24))
  return opt
}
//价格过滤器
export const price = function (opt) {
  if (typeof opt !== 'string') {
    opt = JSON.stringify(opt)
  }
  var ar = []
  for (let i = 0; opt.length > 0; i++) {
    if (opt.length >= 3) {
      ar[i] = opt.substring(opt.length - 3, opt.length)
      opt = opt.substring(0, opt.length - 3)
    } else {
      ar[i] = opt
      opt = ''
    }
  }
  return ar.reverse().join(',')
}

export const house = function (opt) {
  let obj = {
    'D.': '独立屋',
    'S.': '半独立屋',
    'A.': 'Freehold镇屋',
    'C.': '公寓'
  }
  return obj[opt]
}

export const xuqiu = function (opt) {
  if (opt) {
    let obj = {
      'growth': '升值快',
      'lotsize': '地块大',
      'rentalreturn': '租金汇报高',
      'school': '学区好'
    }
    return obj[opt]
  }
}
