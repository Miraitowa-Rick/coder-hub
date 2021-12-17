const service = require('../service/lable.service');

const verifyLableExists = async (ctx,next) => {
        //1. 取出要添加的所有标签
            const {lables} = ctx.request.body;
        //2. 判断每一个标签在lable中是否存在
            const newLables = [];
            for(let name of lables) {
                const lableResult = await service.getLableByName(name);
                const lable = {name};
                if(!lableResult) {
                    const result = await service.create(name);
                    lable.id = result.insertId;
                }else {
                    lable.id = lableResult.id;
                }
                newLables.push(lable);
            }
            console.log(newLables);
            ctx.lables = newLables;
        await next();
}

module.exports = {
    verifyLableExists
}