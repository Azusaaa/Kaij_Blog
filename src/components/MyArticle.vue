<template>
  <el-table
    :data="tableData"
    style="width: 100%; border-radius: 10px; padding-left: 20px"
    v-loading="loading">
    <el-table-column
      label="标题"
      width="280" align="left">
      <template slot-scope="scope"><span style="color: #409eff;cursor: pointer" @click="itemClick(scope.row)">{{ scope.row.title}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="最近编辑时间"
      width="220" >
      <template slot-scope="scope">
        <span >{{ scope.row.editTime | formatTime}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="所属栏目"
      width="180">
      <template slot-scope="scope">
        <span >{{ scope.row.cateName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
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
</template>

<script>
  import {getRequest} from "../utils/api";
  import {deleteRequest} from "../utils/api";

  export default{
    name: 'MyArticle',
    data() {
      return {

        tableData: [
          // 通过/article/all get 获得的数据
        ],
        currentPage:1,
        loading: false,
      }
    },
    methods: {

      handleEdit(index, row) {
        this.$router.push({path: '/editArticle', query: {id: row.id}})
      },
      handleDelete(index, row) {
        let _this = this;
        this.loading = true;
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
      itemClick(row){
        this.$router.push({path: '/article', query: {id:row.id}})
      },
      // 对当前用户所发布的文章进行初始化
      updateContent(){
        var _this = this;
        getRequest('/article/myall?page=1&count=100').then(res => {
          _this.tableData = res.data.articles;
          _this.loading = false;
        }, rej => {
          _this.$message({
            type: 'error',
            message: 'Update Content Fail!'
          });
          _this.loading = false;
        })
      },
      // 删除文章
      deleteCate(ids){
        var _this = this;
        deleteRequest("/article/?aid="+ids).then(res=>{
          _this.updateContent();
          _this.$message({
            type:"success",
            message: "删除成功"
          })
        }, rej=>{
          _this.loading = false;
          _this.$message({
            type: "error",
            message: "删除失败"
          })
        })
      }
    },
    mounted() {
      this.loading = true;
      this.updateContent();
    }
  }
</script>
<style>

</style>
