<template>
  <el-container class="home_container" style="background-color:#ececec;">
    <el-header>
      <div class="home_title">HaiJ博客管理平台</div>
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      router>
        <el-submenu index="/articleList">
          <template slot="title">文章列表</template>
          <el-menu-item index="/articleList">全部栏目</el-menu-item>
          <el-menu-item index="/myArticle">我的文章</el-menu-item>
        </el-submenu>
        <el-menu-item index="/editArticle">文章编辑</el-menu-item>
        <el-menu-item index="/category"  v-show="isSuperUser">栏目管理</el-menu-item>
        <el-menu-item index="/user"  v-show="isSuperUser">用户管理</el-menu-item>
      </el-menu>

      <div class="home_userinfoContainer">
        <span style="color: #fff;" v-cloak>您好，{{isSuperUser? '超级管理员':'普通用户'}}</span>
        <el-dropdown @command="handleCommand">
  <span class="el-dropdown-link home_userinfo" style="font-size: 16px; line-height: 52px;">
    {{currentUserName}}<i class="el-icon-arrow-down el-icon--right home_userinfo"></i>
  </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container style="background-color:#ececec;">
      <el-aside>
      <!--    侧边栏    -->
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-s-promotion"style="padding-right: 10px;"></i>分类专栏</span>
          </div>
          <div v-for="(value,index) in cateList" :key="value.id" class="text item" >
            <span style="color: #409eff;cursor: pointer" @click="cateClick(value.id)">{{value.cateName}}</span>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><i class="el-icon-s-promotion"style="padding-right: 10px;"></i>热门文章</span>
          </div>
          <div v-for="(value1,index1) in articleList" :key="value1.id" class="text item">
            <span style="color: #409eff;cursor: pointer" @click="articleClick(value1.id)">{{value1.title}}</span>
          </div>
        </el-card>
      </el-aside>
      <el-main style="background: #ececec;">
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
  import {getRequest} from "../utils/api";

  export default {
    name: "Home",
    data(){
      return{
          currentUserName: "Visitor",
          isSuperUser: false,
          cateList: [],
          articleList: []
      }
    },
    methods: {
      handleCommand(command){
        var _this = this;
        if (command == 'logout') {
          this.$confirm('注销登录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(function () {
            getRequest("/logout")
            _this.currentUserName = 'Visitor';
            _this.$router.replace({path: '/'});
          }, function () {
            //取消
          })
        }
      },
      cateClick(cid){
        this.$router.push({path: '/articleList', query: {cids: cid}})
      },
      articleClick(id){
        this.$router.replace({path: '/article', query: {id: id}})
      }

    },
    mounted() {
      var _this = this;
      // 用户名和管理员身份确认
      getRequest("/currentUserName").then(res => {
        _this.currentUserName = res.data;
      }, () => {
        _this.currentUserName = "Visitor"
      });
      getRequest('/isAdmin').then(res=>{
        _this.isSuperUser = res.data
      })
      getRequest("/article/category").then(res=>{
        _this.cateList = res.data
      })
      getRequest('/article/all',{
          count: 5,
          page: 1
        }).then(res=>{
          _this.loading = false
          _this.articleList = res.data.articles
        },rej=>{
          _this.loading = false;
          _this.$message({
            type: "error",
            message: "服务器错误ORZ"
          })
        })
    },


  }
</script>

<style scoped>
  .home_container {
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }

  .el-header {
    background-color: #545c64;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .el-aside {
    margin-top: 25px;
    margin-left: 20px;
    background-color: #ECECEC;
  }

  .home_title {
    padding: 0 50px 0 50px;
    color: #fff;
    font-size: 32px;

    display: inline;
  }

  .home_userinfo {
    color: #fff;
    cursor: pointer;
    line-height: 56px;
    font-size: 14px;
  }

  .home_userinfoContainer {
    display: inline;
    margin-right: 20px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 297px;
    border-radius: 10px;
    margin-bottom: 20px;
  }
</style>
