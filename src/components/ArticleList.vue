<template style="background-color: #ececec;">
  <el-container>
    <div style="display: flex;justify-content: space-around;flex-wrap: wrap">
      <div style="margin: 10px 30px 40px 0;justify-content: flex-start;
         background-image: linear-gradient( #545c64, #ececec);cursor: pointer;"
           v-for="(item,index) in categories" :key="index" @click="clickDrawer(item.id)">
        <div style="text-align: center;width: 300px;height: 160px;">
          <span style="font-size: 48px; line-height: 140px; color: #fff; ">{{item.cateName}}</span>
        </div>
      </div>


    </div>
    <el-drawer
      :visible.sync="tableDrawer"
      direction="rtl"
      size="48%">
      <el-table
        :data="tableData"
        style="width: 100% ;border-radius: 10px;margin-left: 50px"
        v-loading="loading">
        <el-table-column
          label="标题"
          width="220" align="left">
          <template slot-scope="scope">
            <span style="color: #409eff;cursor: pointer"
                  @click="itemClick(scope.row)">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="最近编辑时间"
          width="180" >
          <template slot-scope="scope">
            <span >{{ scope.row.editTime | formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="所属栏目"
          width="140">
          <template slot-scope="scope">
            <span >{{ scope.row.cateName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" v-if="isSuperUser">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-left: 50px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-drawer>

  </el-container>
</template>

<script>
  import {deleteRequest, getRequest} from "../utils/api";
  import term from "../assets/二十四节气.jpg"
  import life from "../assets/生活.jpg"
  import study from "../assets/学习.jpg"
  import note from "../assets/笔记.jpg"
  export default{
    name: 'ArticleList',
    data() {
      return {
        queryCids:null,
        totalCount: 10,
        currentPage:1,
        currentCate:"",
        tableDrawer:false,
        showCate: false,
        tableData: [],
        isSuperUser: false,
        loading: false,
        categories: [],
        imgPath:[
          term,
          life,
          study,
          note
        ]
      }
    },
    methods: {
      handleSizeChange(val) {

      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      handleEdit(index, row) {
        this.$router.push({path: '/editArticle', query: {id: row.id}})
      },
      handleDelete(index, row) {
        var _this = this;
        this.$confirm('确认删除文章 ' + row.title + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.deleteCate(row.id);
        }).catch(() => {
          //取消
          _this.loading = false;
        });
      },
      deleteCate(id){
        var _this = this;
        deleteRequest("/article/?aid="+id).then(res => {
          _this.$message({
            type: 'success',
            message: '删除成功！'
          });
          getRequest('/article/categoryArticle?cids='+_this.currentCate).then(res=>{
            _this.tableData = res.data.articles;
            _this.tableDrawer = true;
          },rej=>{
            _this.$message({
              type: "error",
              message: "服务器错误ORZ -- drawer error"
            })
          })
        }, ()=>{
          _this.$message({
            type: 'error',
            message: '删除失败！'
          });
        })
      },
      itemClick(row){
        this.$router.push({path: '/article', query: {id: row.id}})
      },
      clickDrawer(id){
        var _this = this;
        this.currentCate = id;
        getRequest('/article/categoryArticle?count=100&page=1&cids='+id).then(res=>{
          _this.totalCount = res.data.totalCount;
        },rej=>{
          _this.$message({
            type: "error",
            message: "服务器错误ORZ -- drawer error"
          })
        })
        getRequest('/article/categoryArticle?count=10&page=1&cids='+id).then(res=>{
          _this.tableData = res.data.articles;
          _this.tableDrawer = true;
        },rej=>{
          _this.$message({
            type: "error",
            message: "服务器错误ORZ -- drawer error"
          })
        })
      }
    },
    created(){
      var _this = this;
      getRequest('/isAdmin').then(res=>{
        _this.isSuperUser = res.data
      })
    },
    mounted() {
      var _this = this;
      this.loading = true;
      getRequest('/article/category').then(res=>{
        _this.loading = false;
        _this.categories = res.data;
        _this.showCate = true;
      },rej=>{
        _this.loading = false;
        _this.showCate = true;
        _this.$message({
          type:"error",
          message: "服务器错误ORZ, 请稍后重试！"
        })
      });

      var cids = this.$route.query.cids;
      if(cids != "" && cids != null && cids != undefined){
        getRequest('/article/categoryArticle?count=10&page=1&cids='+cids).then(res=>{
          _this.tableData = res.data.articles;
          _this.tableDrawer = true;
        },rej=>{
          _this.$message({
            type: "error",
            message: "服务器错误ORZ -- drawer error"
          })
        })
      }
    },
    watch:{
      $route(){
        this.queryCids = this.$route.query.cids
      },
      queryCids(){
        var _this = this;
        if(this.queryCids != "" && this.queryCids != null && this.queryCids != undefined){
          getRequest('/article/categoryArticle?count=10&page=1&cids='+this.queryCids).then(res=>{
            _this.tableData = res.data.articles;
            _this.tableDrawer = true;
          },rej=>{
            _this.$message({
              type: "error",
              message: "服务器错误ORZ -- drawer error"
            })
          }).catch(err=>{
            console.log("queryCids错误："+err);
          })
        }
      }
    }
  }
</script>


