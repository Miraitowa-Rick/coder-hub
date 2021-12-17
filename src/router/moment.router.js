const Router = require('koa-router');

const momentRouter = new Router({prefix:'/moment'});

const {
    create,
    detail,
    list,
    update,
    remove,
    addLables,
    fileInfo
} = require('../controller/moment.controller')

const {
    verifyAuth,
    verifyPermission
   
} = require('../middleware/auth.middleware');

const {
    verifyLableExists
} = require('../middleware/lable.middleware');

momentRouter.post('/', verifyAuth, create);
momentRouter.get('/', list);
momentRouter.get('/:momentId', detail);
momentRouter.patch('/:momentId',verifyAuth,verifyPermission, update);
momentRouter.delete('/:momentId',verifyAuth,verifyPermission, remove);
momentRouter.post('/:momentId/lables',verifyAuth,verifyPermission, verifyLableExists,addLables);
//动态配图的服务
momentRouter.get('/images/:filename',fileInfo)

module.exports = momentRouter;