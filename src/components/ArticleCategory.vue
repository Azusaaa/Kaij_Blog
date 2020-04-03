<template>

    <el-container>
      <el-header class="cate_mana_header">
        <el-input
          placeholder="请输入栏目名称"
          v-model="cateName" style="width: 200px;">
        </el-input>

        <el-button type="primary" size="mediumn" style="margin-left: 10px" @click="addNewCate" >新增栏目</el-button>
      </el-header>

      <el-main class="cate_mana_main">

        <el-table
          ref="multipleTable"
          :data="categories"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange" v-loading="loading">
          <el-table-column
            type="selection"
            width="55" align="left">
          </el-table-column>


          <el-table-column
            label="栏目名称"
            prop="cateName"
            width="240" align="left">
          </el-table-column>
          <el-table-column
            prop="date"
            label="创建时间" width="280" align="left">
            <template slot-scope="scope">{{ scope.row.date | formatTime}}</template>
          </el-table-column>
          <el-table-column label="操作" align="left">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="danger" :disabled="this.selItems.length==0" style="margin-top: 10px;width: 100px;"
                   @click="deleteAll" v-if="this.categories.length>0">批量删除
        </el-button>
      </el-main>
    </el-container>


</template>

<script>

  import {deleteRequest} from "../utils/api";
  import {getRequest} from "../utils/api";
  import {postRequest} from "../utils/api";
  import {putRequest} from "../utils/api";

  export default{
    name: 'ArticleCategory',
    data(){
      return {
        isSuperUser:null,
        cateName: '',
        selItems: [],
        categories: [
          // {
          //   "id": 1,
          //   "date": "2019-10-21T00:00:00.000+0000",
          //   "cateName": "我要修改一下你"
          // },

        ],
        loading: false,

      }
    },
    methods: {

      //页面内容更新
      refresh(){
        let _this = this;
        getRequest('/admin/category/all').then(res=>{
          _this.categories = res.data;
          _this.loading = false;
        }, rej=>{
          _this.$message({
            type: 'error',
            message: 'Refresh Fail!'
          });
          _this.loading = false;
        })
      },
      //删除栏目
      deleteCate(ids){
        let _this = this;
        this.loading = true;
        deleteRequest('/admin/category/?ids='+ids).then(res=>{
          _this.refresh();
          _this.$message({
            type: 'success',
            message: '删除成功！'
          });
          window.location.reload();
        }, rej => {
          _this.$message({
            type: 'error',
            message: 'Update Content Fail!'
          });
          _this.loading = false;
        })

      },
      //添加新栏目
      addNewCate(){
        this.loading = true;
        let _this = this;
        postRequest('/admin/category/',{
          cateName: this.cateName
        }).then(res=>{
          if(res.data.status == "success"){
            _this.$message({
              type: res.data.status,
              message: res.data.msg
            });
            _this.cateName = '';
            _this.refresh();
          }
          window.location.reload();
          this.loading = false;
        }, reject =>{
          _this.$message({
            type: 'error',
            message: "Add Category Fail"
          });
          _this.loading = false;
        })
      },
      //更改栏目名称
      handleEdit(index, row){
        let _this = this;
        this.$prompt('请输入新名称', '编辑', {
          confirmButtonText: '更新',
          inputValue: row.cateName,
          cancelButtonText: '取消'
        }).then(({value}) => {
          //value就是输入值
          if (value == null || value.length == 0) {
            _this.$message({
              type: 'info',
              message: '数据不能为空!'
            });
          }else{
            _this.loading = true;
            putRequest('/admin/category/',{
              id: row.id,
              cateName: value
            }).then(res =>{
              _this.$message({
                type: res.data.status,
                message: res.data.msg
              });
              _this.refresh();
            }, rej=>{
              _this.$message({
                type: 'error',
                message: "Edit Fail"
              });
              _this.loading = false;
            })
          }
        });
      },
      deleteAll(){
        let _this = this;
        this.$confirm('确认删除这 ' + this.selItems.length + ' 条数据?', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(()=> {
          var selItems = _this.selItems;
          var ids = '';
          for (var i = 0; i < selItems.length; i++) {
            ids += selItems[i].id + ",";
          }
          _this.deleteCate(ids.substring(0, ids.length - 1));
        }).catch(() => {
          //取消
          _this.loading = false;
        });
      },
      handleSelectionChange(val) {
        this.selItems = val;
      },

      handleDelete(index, row){
        let _this = this;
        this.$confirm('确认删除 ' + row.cateName + ' ?', '提示', {
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


    },
    mounted: function () {
      this.loading = true;
      var _this = this;
      // getRequest('/isAdmin').then(res=>{
      //   _this.isSuperUser = res.data;
      // });
      // if(this.isSuperUser)
        this.refresh();
    },

  }
</script>
<style>
  .cate_mana_header {

    background-color: #ececec;
    margin-top: 5px;
    padding: 10px 20px;
    display: flex;
    /*justify-content: center;*/
  }

  .cate_mana_main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    /*padding-left: 5px;*/
    background-color: #ececec;
    margin-top: 10px;
    padding-top: 10px;
  }
</style>
