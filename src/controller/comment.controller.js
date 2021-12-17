const service = require("../service/comment.service.js");
class CommentController{
    async create(ctx,next) {
        const {id} = ctx.user;
        const {momentId,content} = ctx.request.body
        const result = await service.create(momentId,content,id);
        ctx.body = result;
        // ctx.body = "发表成功" + momentId + content
    }
    async reply(ctx, next) {
        const {id} = ctx.user;
        const {momentId,content} = ctx.request.body;
        const {commentId} = ctx.params;
        const result = await service.reply(momentId,content,commentId,id);
        ctx.body = result;
    }
    async update(ctx, next) {
        const {content} = ctx.request.body;
        const {commentId} = ctx.params;
        const result = await service.update(content,commentId);
        ctx.body = result;
    }
    async remove(ctx, next) {
        const {commentId} = ctx.params;
        const result = await service.remove(commentId);
        ctx.body = result;
    }
    async list(ctx, next) {
        const {momentId} = ctx.query;
        const result = await service.getCommentsByMomentId(momentId);
        ctx.body = result;
    }
}

module.exports = new CommentController();