'use strict';

exports.main = async (event, context) => {
  const db = uniCloud.database();
  const collection = db.collection('users');
  
  try {
    const res = await collection.where({
      username: event.username
    }).get();
    
    if (res.data.length === 0) {
      return {
        code: 1,
        message: '用户名或密码错误'
      };
    }
    
    const user = res.data[0];
    const hashedPassword = require('crypto').createHash('md5').update(event.password).digest('hex');
    
    if (user.password !== hashedPassword) {
      return {
        code: 1,
        message: '用户名或密码错误'
      };
    }
    
    // 移除敏感信息
    delete user.password;
    
    return {
      code: 0,
      message: '登录成功',
      data: user
    };
  } catch (error) {
    return {
      code: -1,
      message: '登录失败: ' + error.message
    };
  }
};