import ajax from '../utils/request.js';
import { getUserId, getToUser } from '../utils/util.js';

// 微信登录
export function wxLogin(code, photo, nickname) {
  return ajax({
    code: 627340,
    json: {
      code,
      photo,
      nickname
    }
  });
}
// 获取用户详情
export function getUserInfo() {
  return getUserById(getUserId());
}
// 根据userId获取用户详情
export function getUserById(userId) {
  return ajax({
    code: 627347,
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
// 分页查询云仓产品
export function getPageProduct(start = 1, limit = 100) {
  return ajax({
    code: 627816,
    json: {
      start,
      limit,
      userId: getToUser().userId
    }
  });
}
// 详情查询云仓产品
export function getProduct(code) {
  return ajax({
    code: 627817,
    json: { code }
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
      userId: getUserId()
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
      userId: getUserId(),
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
// 提交订单（无购物车)
export function applyOrder({ province, city, area, address, signer, mobile, productSpecsCode, applyUser, applyNote, toUser, quantity }) {
  return ajax({
    code: 627652,
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
      applyUser: getUserId(),
      isSendHome: 1
    }
  });
}
// 购物车提交订单
export function applyCartOrder({ province, city, area, address, signer, mobile, cartList, applyUser, applyNote, toUser }) {
  return ajax({
    code: 627651,
    json: {
      province,
      city,
      area,
      address,
      signer,
      mobile,
      cartList,
      applyNote,
      toUser,
      applyUser: getUserId(),
      isSendHome: 1
    }
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
      applyUser: getUserId(),
      kind: '4'
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
    json: { codeList, payType: 2 }
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
// 添加购物车
export function addCart(productSpecsCode, quantity) {
  return ajax({
    code: 627620,
    json: {
      productSpecsCode,
      quantity,
      userId: getUserId(),
      level: '6'
    }
  });
}
// 分页获取购物车
export function getPageCart(start, limit) {
  return ajax({
    code: 627630,
    json: {
      start,
      limit,
      userId: getUserId()
    }
  });
}
// 修改购物车产品数量
export function editCartQuantity(code, quantity) {
  return ajax({
    code: 627621,
    json: {
      code,
      quantity
    }
  });
}
// 批量删除产品
export function deleteCartProduct(code) {
  return ajax({
    code: 627622,
    json: {
      codeList: [code]
    }
  });
}