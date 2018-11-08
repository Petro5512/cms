<template>
  <div class="app">
    <div class="header">
      <img src="./assets/eyelogo.jpg" alt="">
      <div class="title">新视界资讯</div>
      <div class="info">
        <img :src="user.userface" alt="">
       <div class="user">
         <el-dropdown  @command="handleCommand">
            <span class="el-dropdown-link">
              {{user.nickname}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item command='logout'>退出</el-dropdown-item>
            </el-dropdown-menu>
         </el-dropdown>
       </div>
      </div>
    </div>
    <div class="content">
      <div class="left_nav">
        <!-- @open="handleOpen"@close="handleClose" -->
        <el-menu default-active="2"class="el-menu-vertical-demo" background-color="#F5DEB3" active-text-color="#8B4513"> 
          
           <el-menu-item index="1">
              <i class="el-icon-location"></i>
             <router-link to='/'>欢迎页面</router-link>
            </el-menu-item>


            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <router-link to='/category'>栏目管理</router-link>
            </el-menu-item>

            <el-menu-item index="3" >
              <i class="el-icon-document"></i>
              <router-link to='/article'>文章管理</router-link>
            </el-menu-item>

            <el-menu-item index="4">
              <i class="el-icon-view"></i>
              <router-link to='/user'>用户管理</router-link>
            </el-menu-item>
        </el-menu>
      </div>
      <div class="right_content">
        <div class="wrapper">
          <router-view></router-view>
        </div>      
      </div>
    </div>
</div>
</template>

<script>
  import axios from'@/http/axios'
export default {
  watch:{
    '$route':function(to,from){
        this.currentRoute=to.path;
    }
  },
  methods:{
    // jump(url){
    //   this.$route.push(url);
    // },
    handleCommand(command){
        if(command=='logout'){
            axios.get('/logout').then(()=>{
            localStorage.removeItem('user')
             });
          }
        }
    },
  created(){
    //处理用户登陆，路由默认显示
    this.currentRoute=this.$route.path;
    let user=JSON.parse(localStorage.getItem('user'));
    if(user){
      this.user=user;
    }else{
      window.vm.currentComponent='Login';
    }
  },
 data(){
  return{
    msg:'App.vue',
    currentRoute:'/',
    user:{}
  }
 }
}
</script>

<style>
html{
  color: #666;
  font:normal normal 12ps "微软雅黑","Mircsoft YaHei";
}
  body,ul,ol,dl,p,h1,h2,h3{
    margin: 0;
    padding: 0;
  }
  ul,ol{
    list-style: none;
  }
  a{
    color: #666;
    text-decoration: none;
  }
  div{
    box-sizing: border-box;
  }
  .app{
    overflow: hidden;
  }
  .header{
    height: 100px;
    background-color: #d3c19b;
    /*background-color: #67c;*/
    padding:0 2em; 
  }
  .header >img{
    float: left;
    height: 100px;
    margin-left: 0.2em;
  }
  .header .title{
    color: #ffffff;
    line-height: 100px;
    font-size: 30px;
    text-shadow: #6A5ACD  3px 3px 5px;
    float: left;
  }
  .header .info{
    line-height:100px;
    height: 100px;
    text-align: right;
  }
  .header .info>img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-top: 20px;
    margin-right:2em;
  }
  .header .info .user{
    float: right;
    cursor: pointer;
  }
  .header .info>.user .el-dropdown{
    color: #fff;
  }
  .content {
    position: absolute;
    top: 100px;
    bottom: 0;
    left:0;
    right: 0;

 }
  .content>.left_nav{
    width: 205px;
    height: 100%;
    float: left;
  }
  .content>.right_content{
    margin-left:205px;
    height: 100%;
    background-color: #f0f0f0;
    padding: 1em;
  }
  .content>.right_content>.wrapper{
    height:100%;
    border-radius:5px;
    background-color: #ffffff;
    padding: .5em;
    overflow-y: auto;
  }
  .left_nav {
    height: 100%;
    background-color: #fff;
  }
 /* .left_nav ul li{
    line-height: 2.5em;
    text-align: center;
    border-bottom: 1px solid #ededed;
  }
*/
</style>

