import ajax from '../utils/request.js';

// 微信登录
export function wxLogin(code) {
  return ajax({
    code: 627302,
    json: { code }
  });
}
// 获取用户详情
export function getUserInfo() {
  return getUserById(wx.getStorageSync('userId'));
}
// 根据userId获取用户详情
export function getUserById(userId) {
  return ajax({
    code: 627357,
    json: { userId }
  });
}
// 获取数据字典列表
export function getDictList(parentKey) {
  if (getDictList[parentKey]) {
    return getDictList[parentKey];
  }
  getDictList[parentKey] = ajax({
    code: 627076,
    json: { parentKey }
  });
  return getDictList[parentKey];
}
// 分页查询产品
export function getPageProduct(start = 1, limit = 100) {
  return ajax({
    code: 627554,
    json: {
      start,
      limit,
      status: 2
    }
  });
}
// 详情查询产品
export function getProduct(code) {
  return ajax({
    code: 627557,
    json: { code }
  });
}
// 提交订单（无购物车)
export function applyOrder({ province, city, area, address, signer, mobile, productSpecsCode, applyUser, applyNote, toUser, quantity }) {
  return ajax({
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
    }
  });
}
// 添加收货地址
export function addAddress({ province, city, area, address, receiver, mobile, isDefault }) {
  return ajax({
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
    }
  });
}
// 修改收货地址
export function editAddress({ code, province, city, area, address, receiver, mobile, isDefault }) {
  return ajax({
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
    }
  });
}
// 删除地址
export function deleteAddress(code) {
  return ajax({
    code: 627402,
    json: { code }
  });
}
// 设置默认地址
export function setDefaultAddr(code) {
  return ajax({
    code: 627403,
    json: { code }
  });
}
// 列表查询地址
export function getAddressList(isDefault) {
  return ajax({
    code: 627411,
    json: {
      isDefault,
      userId: wx.getStorageSync('userId'),
      type: 1
    }
  });
}
// 详情查询地址
export function getAddress(code) {
  return ajax({
    code: 627412,
    json: { code }
  });
}
// 分页查询订单
export function getPageOrder({ start = 1, limit = 100, status = '' }) {
  return ajax({
    code: 627665,
    json: {
      start,
      limit,
      status,
      applyUser: wx.getStorageSync('userId')
    }
  });
}
// 详情查询订单
export function getOrder(code) {
  return ajax({
    code: 627664,
    json: { code }
  });
}
// 取消订单
export function cancelOrder(code) {
  return ajax({
    code: 627646,
    json: { code }
  });
}
// 支付订单
export function payOrder(codeList) {
  return ajax({
    code: 627642,
    json: { codeList, payType: 1 }
  });
}
// 确认收货
export function receiveOrder(code) {
  return ajax({
    code: 627649,
    json: { code }
  });
}
// 获取banner
export function getBanners() {
  return ajax({
    code: 627036,
    json: {
      type: 2,
      location: 'index_banner'
    }
  });
}
// 获取系统参数
export function getSysConfig(ckey) {
  return ajax({
    code: 627087,
    json: {
      ckey,
      companyCode: 'CD-CBH000020',
      systemCode: 'CD-CBH000020'
    }
  });
}