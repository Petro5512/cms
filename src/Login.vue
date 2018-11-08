<template>
	<div class="login">
		<div class="box">
			<h1 class="title">进入新世界</h1>
			 <el-form class='forms' ref='userForm' :rules='rules' :model="form"size="mini"label-position='left'>
			 <el-form-item  prop='username' label="用户名" label-width="5em" style="width:450px">
			 	<el-input v-model="form.username" ></el-input>
			 </el-form-item>
			 <el-form-item prop='password' label="密码" label-width="5em" style="width:450px">
			     <el-input v-model="form.password" type="password"></el-input>
			 </el-form-item>
		 	 </el-form>
		 	 <div class="btns">
		 	 	<el-button size="mini" @click="login">登录</el-button>
		 	 </div>
		</div>
		
	</div>
</template>
<script>
	import axios from'@/http/axios'
	export default{
		data(){
			return{
				form:{},
				rules:{
					username:[{
						required:true,
						message:'请输入用户名',
						trigger:'blur'
					}],
					password:[{
						required:true,
						message:'请输入密码',
						trigger:'blur'
					}]
				}
			}
		},
			methods:{
				login(){

					this.$refs.userForm.validate((valid)=>{
						if(valid){
							axios.post('/login',this.form)
							.then(({data:result})=>{
								if(result.status==200&&result.message=='登录成功'){
									//登陆成功的处理
									//页面跳转
									window.vm.currentComponent='App';
									//用户信息的保存
									localStorage.setItem('user',JSON.stringify(result.data))
									}
								})
							.catch((error)=>{
								this.$notify.error({
									title:'错误',
									message:'网络异常'
								});
							});
						}
					})
					
				}
			}
		}
	
</script>
<style>
	html{
		background-image: url(./assets/door.jpg);
	}
	input:-webkit-autofill{
		-webkit-box-shadow:0 0 0px 1000px white inset
		!important;
	}
	.login{
		width: 400px;
		margin: 0 auto;
	}
	.login .box{
		width: 500px;
		height: 300px;
		background-color: rgba(18,10,8,0.6);
		-moz-padding: 0 30px;
		border-radius: 10px;
	}
	.login .forms{
		margin-top: 50px;
	}
	.login .title{
		margin-top: 150px;
		text-align: center;
		color: #D2691E  ;
		text-shadow: #fff 3px 3px 5px;
	}
	.login .btns{
		text-align: right;
		margin-right: 50px;
	}
</style>