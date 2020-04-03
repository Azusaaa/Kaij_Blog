<template>
  <el-row v-loading="loading" style="background-color:#fff;border-radius: 10px;padding: 16px;">
    <el-col :span="24">
      <div style="text-align: left;">
        <el-button type="text" icon="el-icon-back" @click="goBack" style="padding-bottom: 0px;">返回</el-button>
      </div>
    </el-col>
    <el-col :span="24">
      <div>
        <div><h3 style="margin-top: 0px;margin-bottom: 0px;font-size: 24px;text-align: center">{{article.title}}</h3></div>
        <div style="width: 100%;margin-top: 5px;display: flex;justify-content: flex-end;align-items: center">
          <div style="display: inline; color: #20a0ff;margin-left: 50px;
          margin-right:90px;font-size: 12px; text-align: center">
            {{article.nickname}}
          </div>
          <span style="color: #20a0ff;margin-right:20px;font-size: 12px;">浏览 {{article.pageView==null?0:article.pageView}}</span>
          <span style="color: #20a0ff;margin-right:30px;font-size: 12px;"> {{article.editTime | formatTime}}</span>
          <el-tag type="success" v-for="(item,index) in article.tags" :key="index" size="small"
                  style="margin-left: 8px">{{item.tagName}}
          </el-tag>
          <span style="margin:0px 30px 0px 0px"></span>
        </div>
      </div>
    </el-col>
    <el-col>
      <div class="htmlContent" style="text-align: left;padding: 0 30px;" v-html="article.htmlContent">
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import {getRequest} from "../utils/api";

  export default {
    name: "ArticleDetail",
    data(){
      return {
        queryId: null,
        article: {},
        loading: false,
        activeName: ''
      }
    },

    methods: {
      goBack(){
        this.$router.go(-1);
      },
    },
    mounted: function () {
      this.loading = true
      var _this = this;
      var queryId = this.$route.query.id;
      getRequest('/article/'+queryId).then(res=>{
        _this.loading = false;
        _this.article = res.data;
      }, rej => {
        _this.loading = false;
        _this.$message({
          type: 'error',
          message: "服务器错误QAQ"
        })
      }).catch(err=>{
        console.log("更新文章"+err);
      })
    },
    watch:{
      $route(){
        this.queryId = this.$route.query.id
      },
      queryId(){
        var _this = this;
        getRequest('/article/'+this.queryId).then(res=>{
          _this.loading = false;
          _this.article = res.data;
        }, rej => {
          _this.loading = false;
          _this.$message({
            type: 'error',
            message: "服务器错误QAQ"
          })
        }).catch(err=>{
          console.log("更新文章"+err);
        })
      }
    }

  }
</script>

<style scoped>

  .htmlContent /deep/ img{
    width: 90%;
  }
  .htmlContent /deep/ p{
    font-size: 20px;
    text-indent:40px;
  }
  .htmlContent /deep/ blockquote{
    font-style: italic;
    color: gray;
  }

</style>
