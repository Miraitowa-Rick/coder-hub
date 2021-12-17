const Router = require('koa-router');

const lableRouter = new Router({prefix:'/lable'});

const {
    create,
    list
} = require("../controller/lable.router.js");

const {
    verifyAuth
} = require("../middleware/auth.middleware")

lableRouter.post('/',verifyAuth, create);
lableRouter.get('/',list);

module.exports = lableRouter;