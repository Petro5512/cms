<template>
	<div class="Article">
		<!-- 按钮区 -->
		<div class="btns">
		 <el-select style="width: 180px"size='mini' v-model="params.categoryId" clearable placeholder="请选择">
		    <el-option
		      v-for="c in categories"
		      :key="c.id"
		      :label="c.name"
		      :value="c.id">
		    </el-option>
		 </el-select>
			<el-input placeholder="请输入关键字"prefix-icon="el-icon-search"v-model="params.keywords"size='mini'style="width: 180px"> </el-input>
			<el-button size='mini'  type="primary" @click='toAddArticle'>新增</el-button>
			<el-button size='mini'  type="danger" @click='batchDeleteArticle'>批量删除</el-button>
		</div>
		<!-- 按钮区结束 -->
		<!-- {{params}} -->
		<!-- 列表区 -->
		<div class="article_tbl">
			<el-table :data="articles"style="width: 100%"size="small"border v-loading="loading2"
		  element-loading-text="拼命加载中"
   		  element-loading-spinner="el-icon-loading"
    	  element-loading-background="rgba(0, 0, 0, 0.8)"
    	  @selection-change="handleSelectionChange">
    	  <el-table-column fixed='left' type="selection"width="35"> </el-table-column>
	      <el-table-column prop="title"label="文章标题"width="320"> </el-table-column>
	      <el-table-column align='center' prop="category.name"label="所属栏目"width="150"> </el-table-column>
	      <el-table-column prop="Author"label="作者"width="150"> </el-table-column>
	      <el-table-column align='center' prop="publishtime"label="发布时间"width="180"> </el-table-column>
	      <el-table-column align='center' prop="readtimes"label="阅读次数"width="80"> </el-table-column>
	      <el-table-column align='center' fixed='right' label="操作">
			<template slot-scope='{row}'>
				<i class="fa fa-trash" @click='deleteArticle(row.id)'></i>
				<i class="fa fa-pencil" @click='toUpdateArticle(row)'></i>
			</template>
	      </el-table-column>
	    	</el-table>
		</div>
		<!-- 列表区结束 -->
		<!-- 分页 -->
		<div class="page">
			<el-pagination
			  background
			  layout="prev, pager, next"
			  :page-size='params.pageSize'
			  @current-change='handleCurrentChange'
			  :total="total">
			</el-pagination>
		</div>
		<!-- 模态框 -->
		<el-dialog fullscreen :title="articleDialog.title" :visible.sync="articleDialog.visible">
			<!-- {{articleDialog.form}} -->
		 	 <el-form :model="articleDialog.form"size="mini"label-position='left'>
			     <el-form-item label="咨询名称" label-width="5em">
			     	<el-input v-model="articleDialog.form.title" autocomplete="off"></el-input>
			     </el-form-item>
			     <el-form-item label="所属栏目" label-width="5em">
				     <el-select v-model="articleDialog.form.categoryId" placeholder="一级栏目">
				     	<el-option :key='c.id' v-for='c in categories' :label="c.name" :value="c.id"></el-option>
				     </el-select>
			     </el-form-item>
			     <el-form-item label="列表样式" label-width="5em">
					<ul class="list_style">
						<li class="style_one":class="{current:articleDialog.form.liststyle=='style-one'}" @click="articleDialog.form.liststyle='style-one'">
							<img src="@/assets/style_one.jpg" alt="">
						</li>
						<li class="style_two":class="{current:articleDialog.form.liststyle=='style-two'}" @click="articleDialog.form.liststyle='style-two'">
							<img src="@/assets/style_two.jpg" alt="">
						</li>
					</ul>
			     </el-form-item>

			     <el-form-item label="缩略图" label-width="5em">
					<el-upload
					  action="http://39.108.76.225:8099/manager/file/upload"
					  :on-success='handleUploadSuccess'
					  :file-list='fileList'
					  :on-remove='handleFileRemove'
					  list-type="picture">
					  <el-button size="small" type="primary">点击上传</el-button>
					  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
			     </el-form-item>

			     <el-form-item label="咨询正文" label-width="5em">
			     	<!-- <el-input v-model="articleDialog.form.content"type="textarea" :rows="3"></el-input> -->
			     	<mavon-editor ref="articleContent" v-model="articleDialog.form.content"/>
			     </el-form-item>
		 	 </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button size='mini'@click='closeArticleDialog'>取 消</el-button>
		    <el-button type="primary"size='mini' @click='saveOrUpdateArticle'>确 定</el-button>
		  </div>
		</el-dialog>
	</div>
</template>
<script>
	import axios from '@/http/axios';
	export default{
		data(){
			return{
				categories:[],
				articles:[],
				multipleSelection:[],
				loading2:false,
				total:10,
				fileList:[],
				params:{
					page:0,
					pageSize:4,
					// categoryId:undefined,
					// keywords:undefined
				},
				articleDialog:{
					title:'',
					visible:false,
					form:{
						liststyle:'style_one',
						fileIds:[]
					}
				}
			}
		},
		watch:{
			params:{
				handler:function(){
					this.findAllArticles();
				},
				deep:true
			}
		},
		created(){
			this.findAllCategories();
			this.findAllArticles();
		},
		methods:{
			handleFileRemove(file){
				//通过id删除附件
				axios.get('/manager/file/delete',{
					params:{id:file.name}
				}).then(()=>{
						this.$notify.success({
					         title: '成功',
					         message: '删除成功！'
					       });
						//从fileIds中挪出
						_.remove(this.articleDialog.form.fileIds,(id)=>{
							return id==file.name
							})
						this.articleDialog.form.fileIds.push(1);
						this.articleDialog.form.fileIds.pop();
						})
					.catch(()=>{
						 this.$notify.error({
					         title: '失败',
					         message: '删除失败！'
						});
					});
				
			},
			handleUploadSuccess(response,file,fileList){
				file.name=response.data.id;
				this.articleDialog.form.fileIds.push(response.data.id);
			},
			toAddArticle(){
				this.articleDialog.title='发布资讯';
				this.articleDialog.form={
					liststyle:'style-one',
					fileIds:[]
				};
				this.articleDialog.visible=true;
			},
			batchDeleteArticle(){
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        })
		        .then(()=>{
		        	let ids = this.multipleSelection.map((item)=>{
						return item.id;
					});
				axios.post('/manager/article/batchDeleteArticle',{ids})
				.then(()=>{
						this.$notify.success({
				          title: '成功',
				          message: '删除成功！'
				        });
				        this.findAllArticles();
					})
					.catch(()=>{
						 this.$notify.error({
				          title: '失败',
				          message: '删除失败！'
						});
					});
		        });
			},
			saveOrUpdateArticle(){
				//将html绑定到form.source上
				this.articleDialog.form.source=this.$refs.articleContent.d_render;
				axios.post('/manager/article/saveOrUpdateArticle',this.articleDialog.form)					
					.then(()=>{
						this.$notify.success({
					         title: '成功',
					         message: '提交成功！'
					       });
						   this.closeArticleDialog();
					       this.findAllArticles();
						})
					.catch(()=>{
						 this.$notify.error({
					         title: '失败',
					         message: '提交失败！'
						});
					});
			},
			closeArticleDialog(){
				this.articleDialog.visible=false;
			},
			handleCurrentChange(page){
				this.params.page=page-1;
			},
			deleteArticle(id){
				this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(()=>{
			        axios.get('/manager/article/deleteArticleById?id='+id)
					.then(()=>{
						this.$notify.success({
				          title: '成功',
				          message: '删除成功！'
				        });
				        this.findAllArticles();
					})
					.catch(()=>{
						 this.$notify.error({
				          title: '失败',
				          message: '删除失败！'
						});
					});
		        })
			},
			toUpdateArticle(row){
				//删除categoory，添加categoryId
				let article=_.clone(row);
				article.categoryId=article.category.id;
				delete article.category;
				//处理附件默认显示
				this.fileList=article.articleFileVMs.map((item)=>{
					return{
						name:item.cmsFile.id,
						url:'http://39.108.81.60:8888/group1/'+item.cmsFile.id

					}
				})
				//删除articleFileVMs,添加fileIds
				article.fileIds=article.articleFileVMs.map(item=>item.cmsFile.id);
				delete article.articleFileVMs;
				//将值为空的属性删除
				for(let key in article){
					let val=article[key];
					if(!val){
						delete article[key];
					}
				}

				this.articleDialog.form=article;
				this.articleDialog.title='修改咨询';
				this.articleDialog.visible=true;
			},
			//查询所有栏目
			findAllCategories(){
				axios.get('/manager/category/findAllCategory')
				.then(({data:result})=>{
					this.categories=result.data;
				})
				.catch(()=>{
					 this.$notify.error({
			          title: '错误',
			          message: '网络异常'
					});
				})
			},
			//查询所有文章
			findAllArticles(){
				this.loading2=true;
				axios.get('/manager/article/findArticle',{
					params:this.params
				})
				.then(({data:result})=>{
					this.total=result.data.total;
					this.articles=result.data.list;
				})
				.catch(()=>{
					 this.$notify.error({
			          title: '错误',
			          message: '网络异常'
					});
				})
				.finally(()=>{
				this.loading2=false;

				})
			},
				handleSelectionChange(val){
				 this.multipleSelection = val;
			},
		}
	}
</script>
<style>
	.btns{
		margin-bottom: .5em;
	}
	.dialog-footer{
		margin-top: 1em;
	}
	i.fa{
		margin: 0 .8em;
		cursor: pointer;
	}
	i.fa.fa-trash{
		color: #F56C6C;
		font-size: 14px;
	}
	i.fa.fa-pencil{
		color: #E6A23C;
		font-size: 14px;
	}
	.page{
		margin-top: 2em;
	}
	.list_style >li{
		width: 200px;
		height: 80px;
		border: 1px solid #ededed;
		border-radius: 3px;
		padding: .5em;
	}
	.list_style >li.current{
		border-color: #409eff;
	}
	.list_style >li img{
		width: 100%;
	}
	.list_style >li.style_one{
		float: left;
	}
	.list_style >li.style_two{
		margin-left: 220px;
	}
</style>