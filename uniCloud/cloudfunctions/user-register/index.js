'use strict';

exports.main = async (event, context) => {
  // event.userInfo 是当前登录用户信息
  const db = uniCloud.database();
  const collection = db.collection('users');
  
  try {
    const res = await collection.where({
      username: event.username
    }).get();
    
    if (res.data.length > 0) {
      return {
        code: 1,
        message: '用户名已存在'
      };
    }
    
    // 简单的密码加密（实际应该用bcrypt）
    const hashedPassword = require('crypto').createHash('md5').update(event.password).digest('hex');
    
    const addRes = await collection.add({
      username: event.username,
      email: event.email,
      password: hashedPassword,
      avatar: 'https://via.placeholder.com/120',
      created_at: new Date()
    });
    
    return {
      code: 0,
      message: '注册成功',
      data: addRes.id
    };
  } catch (error) {
    return {
      code: -1,
      message: '注册失败: ' + error.message
    };
  }
};