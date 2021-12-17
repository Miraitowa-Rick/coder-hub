const service = require("../service/lable.service")

class LableController {
    async create(ctx,next) {
        const {id} = ctx.user;
        const {name} = ctx.request.body;
        const result = await service.create(name);
        ctx.body = result;
    }
    async list(ctx,next) {
        const {offset,limit} = ctx.query;
        const result = await service.getLables(offset,limit);
        ctx.body = result;
    }
    
}

module.exports = new LableController();