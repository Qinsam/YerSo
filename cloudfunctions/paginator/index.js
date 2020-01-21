// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();


// 云函数入口函数
exports.main = async (event, context) => {
  var dbName = event.dbName;
  var filter = event.filter ? event.filter : null;
  var pageIndex = event.pageIndex ? event.pageIndex : 0;
  var pageSize = event.pageSize ? event.pageSize : 10;

  const countResult = await db.collection(dbName).count()
  const total = countResult.total;
  const totalPage = Math.ceil(total / 10);//计数需要多少页
  var hasMore;//提示前端是否还有数据
  if (pageIndex > totalPage || pageIndex == totalPage) {
    hasMore = false;
  } else {
    hasMore = true;
  }
  return db.collection(dbName).skip(pageIndex * pageSize).limit(pageSize).get().then(res => {
    res.hasMore = hasMore;
    return res;
  })
}