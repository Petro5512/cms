import axios from 'axios';
import qs from 'qs'

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://39.108.76.225:8888'
// axios.defaults.baseURL = 'http://39.108.76.225:8099'
// axios.defaults.baseURL = 'http://120.78.164.247:8099'
axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded;charset=UTF-8'
axios.interceptors.request.use((config)=>{
	if(config.method == 'post'){
		config.data = qs.stringify(config.data,{arrayFormat:'repeat'});
	}
	return config;
},(error)=>{
	return Promise.reject(error);
});

axios.interceptors.response.use((response)=>{
	if(response&&response.data.status==500&&response.data.message=='尚未登录，请登录!'){
		window.vm.currentComponent='Login';
	}
	return response;
});

export default axios;