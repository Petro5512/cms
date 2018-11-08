<template>
  <div class="User">
     <!-- 按钮区 -->
     <div class="btns">
       <el-button size='mini'  type="primary" @click='toAddUser'>新增</el-button>
     </div>
     <!-- 用户区 -->
     <div class="users_list">
          <ul v-for="u in users">
            <li class="yh">
              <div class="closes">
                 <i class="fa fa-close" @click='deleteUser(u.id)'></i>
              </div>
              <div class="tx">
                 <img :src="u.userface" alt="图像加载失败">
              </div>
               <div>
                <span>用户名称:</span>
                {{u.username}}
              </div>
              <div>
                <span>真实姓名:</span>
                {{u.nickname}}
              </div>
              <div>
                <span>注册时间:</span>
                {{u.regTime}}
              </div>
              <div>
                <span>电子邮箱:</span>
                {{u.email}}
              </div>
            </li>
          </ul>
     </div>
     <!-- 模态框 -->
       <el-dialog :title="uDialog.title" :visible.sync="uDialog.visible">
        <el-form :model="uDialog.form">
          <el-form-item label="用户名称" label-width="5em">
            <el-input v-model="uDialog.form.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" label-width="5em">
            <el-input v-model="uDialog.form.nickname" > </el-input>
          </el-form-item>
         <!--  <el-form-item label="注册时间" label-width="5em">
            <el-input v-model="uDialog.form.regTime" > </el-input>
          </el-form-item> -->
          <el-form-item label="电子邮箱" label-width="5em">
            <el-input v-model="uDialog.form.email" > </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="closeuDialog">取 消</el-button>
          <el-button size="mini" type="primary" @click="saveOrUpdateUser">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
  import axios from'@/http/axios'
  export default{
    data(){
      return{
        users:[],
        uDialog:{
          title:"",
          visible:false,
          form:{}
        }
      }
    },
    created(){
        this.findAllUsers();
    },
    methods:{
     saveOrUpdateUser(){
        axios.post('/manager/user/saveOrUpdateUser',this.uDialog.form)          
          .then(()=>{
            this.$notify.success({
                   title: '成功',
                   message: '提交成功！'
                 });
               this.closeuDialog();
                 this.findAllUsers();
            })
          .catch(()=>{
             this.$notify.error({
                   title: '失败',
                   message: '提交失败！'
            });
          });
        },
      closeuDialog(){
        this.uDialog.form={};
        this.uDialog.visible=false;
      },
      toAddUser(){
        this.uDialog.title='新增用户';
        this.uDialog.visible=true;
      },
      deleteUser(id){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(()=>{
              axios.get('/manager/user/deleteUserById?id='+id)
          .then(()=>{
            this.$notify.success({
                  title: '成功',
                  message: '删除成功！'
                });
                this.findAllUsers();
          })
          .catch(()=>{
             this.$notify.error({
                  title: '失败',
                  message: '删除失败！'
            });
          });
            })
      },
      findAllUsers(){
        axios.get('/manager/user/findAllUser')
        .then(({data:result})=>{
            this.users=result.data;
        })
        .catch(()=>{
           this.$notify.error({
                title: '错误',
                message: '网络异常'
          });
        })
      }
    }
  }
</script>
<style>
  .btns{
    margin-bottom: 1em;
  }
  .tx>img{
    width: 200px;
    height: 200px;
    border-radius: 50%;
  }
  .yh{
    float: left;
    width: 250px;
    border: 1px solid #ededed;
    border-radius: 10px;
    box-shadow: #ccc 1px 1px 3px;
    margin:0 5em 20px 0;
    padding: 1em;
    text-align: left;
    position: relative;
  }

  .yh .closes>i{
    position: absolute;
    top: 10px;
    right: .5em;
    cursor: pointer;
  }
  .yh .tx{
    text-align: center;
  }
  
 
</style>