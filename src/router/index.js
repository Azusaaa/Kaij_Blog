import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Reg from '@/components/Reg'
import Home from "@/components/Home";
import EditArticle from "@/components/EditArticle";
import ArticleList from "@/components/ArticleList";
import ArticleDetail from "@/components/ArticleDetail";
import ArticleCategory from "@/components/ArticleCategory";
import UserManage from "@/components/UserManage";
import MyArticle from "@/components/MyArticle";

Vue.use(Router)

const router = new Router({

  routes: [
    {
      path: '/',
      meta: {title: '用户登陆'},
      component: Login
    },
    {
      path: '/login',
      meta: {title: '用户登陆'},
      component: Login
    },
    {
      path: '/reg',
      meta: {title: '用户注册'},
      component: Reg
    },
    {
      path: '/home',
      component: Home,
      meta: {title: '首页'},
      children: [
        {
          path: '/editArticle',
          meta: {title: '发布文章'},
          component: EditArticle
        },
        {
          path: '/articleList',
          meta: {title: '文章列表'},
          component: ArticleList
        },
        {
          path: '/myArticle',
          meta: {title: '我的文章'},
          component: MyArticle
        },
        {
          path: "/article",
          meta: {title: '文章内容'},
          component: ArticleDetail
        },
        {
          path: "/category",
          meta: {title: '文章类别'},
          component: ArticleCategory
        },
        {
          path: "/user",
          meta: {title: '用户管理'},
          component: UserManage
        }
      ]
    }
  ]
})
//导航卫士
router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  next();

  // 通过localStorage判断是否登录
  // if(window.localStorage.getItem('token')){
  //   window.document.title = to.meta.title;
  //   next();
  // }else{
  //
  //   next('/login')
  // }
});
export default router
