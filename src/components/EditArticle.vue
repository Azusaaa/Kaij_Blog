<template>
  <el-container v-loading="loading" class="post-article">
    <el-header class="header">
      <el-select v-model="article.cid" placeholder="请选择文章栏目" style="width: 150px;">
        <el-option
          v-for="item in categories"
          :key="item.id"
          :label="item.cateName"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input v-model="article.title" placeholder="请输入标题..." style="width: 400px;margin-left: 10px"></el-input>
      <el-tag
        :key="tag"
        v-for="tag in article.dynamicTags"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)" style="margin-left: 10px">
        {{tag}}
      </el-tag>
      <el-input
        class="input-new-tag"
        v-if="tagInputVisible"
        v-model="tagValue"
        ref="saveTagInput"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm">
      </el-input>
      <el-button v-else class="button-new-tag" type="primary" size="small" @click="showInput">+Tag</el-button>
    </el-header>
    <el-main class="main">
      <div id="editor">
        <mavon-editor style="height: 100%;width: 100%;" ref=md  @imgAdd="imgAdd" :toolbars="toolbars"
                      v-model="article.mdContent"></mavon-editor>
      </div>
      <div style="display: flex;align-items: center;margin-top: 15px;justify-content: flex-end">
        <el-button type="default" @click="resetArticle">重置内容</el-button>
        <template v-if="article.id=='-1'">
          <el-button type="primary" @click="uploadArticle">发表文章</el-button>
        </template>
        <template v-else>
          <el-button type="primary" @click="uploadArticle">保存修改</el-button>
        </template>
      </div>
    </el-main>
  </el-container>
</template>
<script>
  import {getRequest, postRequest} from "../utils/api";
  import {putRequest} from "../utils/api";
  import {uploadFileRequest} from "../utils/api";
  import {mavonEditor} from 'mavon-editor'
  import "mavon-editor/dist/css/index.css"


  export default {
    name: "EditArticle",
    components: {
      mavonEditor
    },
    methods: {
      //重置内容
      resetArticle(){
        let _this = this;
        this.$confirm('您将清除本文所有内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.article = {};
          _this.$message({
            type: 'success',
            message: '清除成功!'
          });
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消清除'
          });
        });

      },
      //上传文章
      uploadArticle(){
        var _this = this;
        this.loading = true;
        postRequest('/article/',{
          id: _this.article.id,
          title: _this.article.title,
          mdContent: _this.article.mdContent,
          htmlContent: _this.$refs.md.d_render,
          cid: _this.article.cid,
          cateName: _this.article.cateName,
          dynamicTags: _this.article.dynamicTags
        }).then(res => {
          _this.loading = false;
          if(res.status == 200 && res.data.status == "success"){
            _this.article.id = res.data.msg;
            _this.$message({type: 'success', message: '操作成功!'});
            _this.$router.replace({path: '/myArticle'})
          }
        },()=>{
          _this.loading = false;
          _this.$message({type: 'error', message: '操作失败!'});
        }).catch(err => {
          _this.loading = false;
          console.log("上传失败"+err);
        })
      },
      //添加图片
      imgAdd(pos, $file){
        var _this = this;
        var formdata = new FormData();
        formdata.append('image', $file);
        uploadFileRequest("/article/uploadimg", formdata).then(resp=> {
          var json = resp.data;
          if (json.status == 'success') {
//            _this.$refs.md.$imgUpdateByUrl(pos, json.msg)
            _this.$refs.md.$imglst2Url([[pos, json.msg]])
          } else {
            _this.$message({type: json.status, message: json.msg});
          }
        });
      },

      // 文章类别选项初始化
      updateCategory(){
        var _this = this;
        getRequest('/article/category').then(res => {
          _this.categories = res.data
        }, rej=>{
          _this.categories = ["获取失败"]
        })
      },
      handleClose(tag) {
        this.article.dynamicTags.splice(this.article.dynamicTags.indexOf(tag), 1);
      },
      showInput() {
        this.tagInputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let tagValue = this.tagValue;
        if (tagValue) {
          this.article.dynamicTags.push(tagValue);
        }
        this.tagInputVisible = false;
        this.tagValue = '';
      },
      // 判断是创建文章还是修改文章
      getArticle(){
        var _this = this;
        var id = this.$route.query.id;
        if( id == '' || id == undefined || id == null){
          _this.id = "-1";
          _this.loading = false;
        }else{
          getRequest("/article/"+ id).then(res => {
            _this.loading = false;
            _this.article = res.data;
            var tags =res.data.tags;
            _this.article.dynamicTags = [];
            //插入动态标签
            for (var i=0; i<tags.length; i++){
              _this.article.dynamicTags.push(tags[i].tagName)
            }
          }, rej => {
            _this.loading = false;
            _this.$message({type: 'error', message: '页面加载失败!'})
          })
        }
      }

    },
    mounted() {
      this.loading = true;
      this.updateCategory();
      this.getArticle();
    },
    data() {
      return {
        categories: [],
        tagInputVisible: false,
        tagValue: '',
        loading: false,
        from: '',
        article: {
          id: '-1',
          dynamicTags: [],
          title: '',
          mdContent: '',
          cid: ''
        },
        toolbars: {
          bold: true, // 粗体
          italic: true, // 斜体
          header: true, // 标题
          underline: true, // 下划线
          strikethrough: true, // 中划线
          mark: false, // 标记
          superscript: false, // 上角标
          subscript: false, // 下角标
          quote: true, // 引用
          ol: true, // 有序列表
          ul: true, // 无序列表
          link: true, // 链接
          imagelink: true, // 图片链接
          code: true, // code
          table: true, // 表格
          fullscreen: true, // 全屏编辑
          readmodel: false, // 沉浸式阅读
          htmlcode: true, // 展示html源码
          help: false, // 帮助
          /* 1.3.5 */
          undo: true, // 上一步
          redo: false, // 下一步
          trash: false, // 清空
          save: false, // 保存（触发events中的save事件）
          /* 1.4.2 */
          navigation: false, // 导航目录
          /* 2.1.8 */
          alignleft: true, // 左对齐
          aligncenter: true, // 居中
          alignright: true, // 右对齐
          /* 2.2.1 */
          subfield: true, // 单双栏模式
          preview: true, // 预览
          boxShadow: false
        }
      }
    }
  }
</script>
<style>
  .post-article > .main > #editor {
    width: 100%;
    height: 450px;
    text-align: left;
  }

  .post-article > .header {
    background-color: #ececec;
    margin-top: 10px;

    padding: 10px 0 0 20px;
    display: flex;
    justify-content: flex-start;
  }

  .post-article > .main {
    /*justify-content: flex-start;*/
    display: flex;
    flex-direction: column;
    /*padding-left: 5px;*/
    background-color: #ececec;
    padding-top: 0px;
  }

  .post-article > .header > .el-tag + .el-tag {
    margin-left: 10px;
  }

  .post-article > .header > .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .post-article > .header > .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
