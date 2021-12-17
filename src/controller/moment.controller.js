const fs = require('fs');
const {PICTURE_PATH}  = require('../constants/file-path')
 
const fileService = require('../service/file.service');
const momentService = require('../service/moment.service');
class MomentController {
  async create(ctx, next) {
    // 1.获取数据(user_id, content)
    const userId = ctx.user.id;
    const content = ctx.request.body.content;
    console.log(userId);
    // 2.将数据插入到数据库
    const result = await momentService.create(content, userId );
    ctx.body = result;
  }
  async detail(ctx, next) {
    //1. 获取数据（momentId)
    const momentId = ctx.params.momentId;
   // 2. 根据id 去查询这条数据
    const result = await momentService.getMomentById(momentId);

    ctx.body = result;
  }
  async list(ctx, next) {
      //1.获取数据（offect, size)
    const {offset , size} = ctx.query;
        // 2. 查询列表
    const result = await  momentService.getMomentList(offset,size);
    ctx.body = result;
  }
  async update(ctx, next) {
      //1. 获取参数
        const {momentId} = ctx.params;
        const {content} = ctx.request.body;
      //2. 修改内容
      const result = await momentService.update(content, momentId);
      ctx.body = result;
  }
  async remove(ctx, next) {
      const {momentId} = ctx.params;
      const result = await momentService.remove(momentId);
      ctx.body = result;
  }
  async addLables(ctx, next) {
      //1. 获取标签和动态id
    const {momentId} = ctx.params;
    const {lables} = ctx;
    //2. 添加所有标签
    for(let lable of lables) {
        //2.1 判断标签是否和动态有关系
        const isExists = await momentService.hasLable(momentId,lable.id);
        if(!isExists) {
            await momentService.addLable(momentId,lable.id);
        }
    }
    // const result = await momentService.(momentId,content);
    // ctx.body = result;
    ctx.body = "添加标签成功" + momentId + lables;
}

  async fileInfo(ctx, next) {
    try {
      let {filename} = ctx.params;
   const fileInfo = await fileService.getFileByFilename(filename);
    const {type} = ctx.query;
    const types =  ["small","middle","large"];
    if(types.some(item => item === type)){
      filename = filename + '-' + type;
    }
   ctx.response.set('content-type', fileInfo.mimetype);
   ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
    } catch (error) {
      console.log(error);
    }
}
}

module.exports = new MomentController();