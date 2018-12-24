/* eslint-disable */
export const enterShop = function (tracker, params) {
  tracker.ready(function () {
    this.push({});
    this.track('c_enter_shop', params)
  })
}

export const searchKeyWords = function (tracker, params) {
  tracker.ready(function () {
    this.push({});
    this.track('c_search_keywords', params)
  })
}

export const shopCart = function (tracker, params) {
  tracker.ready(function () {
    this.push({});
    this.track('c_shop_show_cart', params)
  })
}

export const payOrder = function (tracker, params) {
  if (tracker) {
    tracker.track('c_pay_for_order', params)
  }
}

export const clickCategory = function (tracker, params) {
  tracker.ready(function () {
    this.push({});
    this.track('c_click_category', params)
  })
}

export const goodsDeatil = function (tracker, params) {
  tracker.ready(function () {
    this.push({});
    this.track('c_shop_browse_product', params)
  })
}



