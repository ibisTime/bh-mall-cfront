import ajax from '../common/request.js';

// 微信登录
export function wxLogin(code, suc, fail) {
  ajax({
    code: 627302,
    json: { code },
    success: function (data) {
      suc && suc(data);
    },
    fail: function (err) {
      fail && fail(err);
    }
  });
}

export function getUserInfo(suc, fail) {
  ajax({
    code: 627357,
    json: {
      userId: wx.getStorageSync('userId')
    },
    success: function (data) {
      suc && suc(data);
    },
    fail: function (err) {
      fail && fail(err);
    }
  })
}

// 分页查询产品
export function getPageProduct(start = 1, limit = 100, suc, fail) {
  ajax({
    code: 627554,
    json: {
      start,
      limit,
      status: 2
    },
    success: function (data) {
      suc && suc(data);
    },
    fail: function (err) {
      fail && fail(err);
    }
  });
}

// 详情查询产品
export function getProduct(code, suc, fail) {
  ajax({
    code: 627557,
    json: {
      code
    },
    success: function (data) {
      suc && suc(data);
    },
    fail: function (err) {
      fail && fail(err);
    }
  });
}

// 提交订单（无购物车)
export function applyOrder({ province, city, area, address, signer, mobile, productSpecsCode, applyUser, applyNote, toUser, quantity }, suc, fail) {
  ajax({
    code: 627641,
    json: {
      province,
      city,
      area,
      address,
      signer,
      mobile,
      productSpecsCode,
      applyNote,
      toUser,
      quantity,
      applyUser: wx.getStorageSync('userId'),
      isSendHome: 1
    },
    success: function (data) {
      suc && suc(data);
    },
    fail: function (err) {
      fail && fail(err);
    }
  });
}

// 添加收货地址
export function addAddress({ province, city, area, address, receiver, mobile, isDefault }, suc, fail) {
  ajax({
    code: 627400,
    json: {
      province,
      city,
      area,
      address,
      receiver,
      mobile,
      isDefault,
      type: 1,
      userId: wx.getStorageSync('userId')
    },
    success: function (data) {
      suc && suc(data);
    },
    fail: function (err) {
      fail && fail(err);
    }
  });
}
// 修改收货地址
export function editAddress({ code, province, city, area, address, receiver, mobile, isDefault }, suc, fail) {
  ajax({
    code: 627401,
    json: {
      code,
      province,
      city,
      area,
      address,
      receiver,
      mobile,
      isDefault
    },
    success: function (data) {
      suc && suc(data);
    },
    fail: function (err) {
      fail && fail(err);
    }
  });
}
// 删除地址
export function deleteAddress(code, suc, fail) {
  ajax({
    code: 627402,
    json: { code },
    success: function (data) {
      suc && suc(data);
    },
    fail: function (err) {
      fail && fail(err);
    }
  });
}
// 列表查询地址
export function getAddressList(isDefault, suc, fail) {
  ajax({
    code: 627411,
    json: {
      isDefault,
      userId: wx.getStorageSync('userId'),
      type: 1
    },
    success: function (data) {
      suc && suc(data);
    },
    fail: function (err) {
      fail && fail(err);
    }
  });
}
// 详情查询地址
export function getAddress(code, suc, fail) {
  ajax({
    code: 627412,
    json: { code },
    success: function (data) {
      suc && suc(data);
    },
    fail: function (err) {
      fail && fail(err);
    }
  });
}
// 分页查询订单
export function getPageOrder({ start = 1, limit = 100, status = '' }, suc, fail) {
  ajax({
    code: 627665,
    json: {
      start,
      limit,
      status
    },
    success: function (data) {
      suc && suc(data);
    },
    fail: function (err) {
      fail && fail(err);
    }
  });
}