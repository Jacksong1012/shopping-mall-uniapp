'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database();
  const collection = db.collection('products');
  
  try {
    let query = collection;
    
    // 如果有分类过滤
    if (event.category) {
      query = query.where({
        category: event.category
      });
    }
    
    // 搜索功能
    if (event.search) {
      query = query.where({
        name: new RegExp(event.search)
      });
    }
    
    const res = await query
      .limit(event.limit || 10)
      .skip(event.skip || 0)
      .get();
    
    return {
      code: 0,
      message: '获取成功',
      data: res.data
    };
  } catch (error) {
    return {
      code: -1,
      message: '获取失败: ' + error.message
    };
  }
};