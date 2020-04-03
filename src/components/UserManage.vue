<template>
  <el-container v-loading="loading" >
    <div style="display: flex;justify-content: space-around;flex-wrap: wrap" >
      <el-card style="width:330px;margin: 10px 20px 10px 0;" v-for="(user,index) in users" :key="index">
        <div slot="header" style="text-align: left">
          <span>{{user.username}}</span>
          <el-button style="float: right; padding: 3px 0;color: #ff0509" type="text" icon="el-icon-delete"
                     @click="deleteUser(user.id)">删除
          </el-button>
        </div>
        <div>
          <div style="text-align: left;color:#20a0ff;font-size: 16px;margin-top: 0px">
            <span>注册时间:</span><span>{{user.regTime | formatTime}}</span>
          </div>
          <div style="text-align: left;color:#20a0ff;font-size: 16px;margin-top: 13px">
            <span>用户角色:</span>
            <el-tag
              v-for="role in user.roles"
              :key="role.id"
              size="small"
              style="margin-right: 8px"
              type="success">
              {{role.name}}
            </el-tag>
            <el-popover
              placement="right"
              title="角色列表"
              width="200"
              :key="index+''+user.id"
              trigger="click">
            </el-popover>
          </div>
        </div>
      </el-card>
    </div>
  </el-container>
</template>
<script>
  import {getRequest} from '../utils/api'
  import {putRequest} from '../utils/api'
  import {deleteRequest} from '../utils/api'

  export default{
    mounted: function () {
      var _this = this;
      this.loading = false;
      _this.refresh()

    },
    methods: {
      //获取用户列表
      refresh(){
        var _this = this;
        getRequest('/admin/user/all').then(res=>{
          _this.users = res.data
        },()=>{
          _this.$message({
            type:"error",
            message:"获取用户失败"
          })
        })
      },

      deleteUser(id){
        var _this = this;
        this.$confirm('确认删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRequest('/admin/user/'+id).then(res=>{
            _this.$message({
              type: "success",
              message: "删除用户成功"
            });
            _this.refresh()
          }, rej=>{
            _this.$message({
              type: "success",
              message: "删除用户失败，请重试！"
            });
          })
        }).catch(() => {
          //取消
          _this.loading = false;
        });

      },


    },
    data(){
      return {
        isSuperUser:undefined,
        loading: false,
        eploading: [],
        cardloading: [],
        keywords: '',
        users: [

        ],
        roles: [

        ],
      }
    }
  }
</script>
