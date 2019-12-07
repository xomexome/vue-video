import axios from 'axios'
export const url = 'http://localhost:3000';
//自定义配置创建axios
let $axios = axios.create({
// `baseURL`将被添加到`url`前面，除非`url`是绝对的。
// 可以方便地为 axios 的实例设置`baseURL`，以便将相对 URL 传递给该实例的方法。
  baseURL: url + '/vi/',
});
//读取cookies
function getCookie(name) {
    //正则表达式，寻找对应的字符串
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

function $fetch(method,url,data){
    /*
      在一个promise链中，只要任何一个promise被reject，promise链就被破坏了，
      reject之后的promise都不会再执行，而是直接调用.catch方法。
    */
    return new Promise((reslove,reject)=>{
        //将相关配置传递给 axios 来进行请求
        $axios({
            method,
            url,
            data:data,
            headers:{
                token: getCookie('token')
            }
        }).then(res=>{
            let body = res.data
            if (body.code == 200 || body.code == 201) {
                reslove(body)
            }else{
                reject(body)
            }
        }).catch(err=>{
            reject(err)
        })

    })
}

// 首页初始化数据
export const initHome = () => $fetch('get', 'list')

// 验证码
export const yzmChange = () => $fetch('get','getYzm')

// 注册登录
export const signin = (userName, password) => $fetch('post','signin', {userName,password})

// 个人评论
export const meComment = (userName) => $fetch('post', 'getUserComment', {userName})


// 获取用户喜欢不喜欢数据
export const meLike = ( userName ) => $fetch('post','getUserLikeData',{userName})

// 删除评论---
export const meDelete = (commentId, userName) => $fetch('post','deleteComment',{userName,commentId})


// 上传头像----
export const uploadAvator = ( userName , avator ) => $fetch('post','uploadAvator',{avator,userName})

// 获取头像
export const getAvator = (userName) => $fetch('post', 'getUserAvator' ,{userName})

// 编辑用户名
export const editNameData = ( oldName , newName) =>  $fetch('post','editUserName', {newName,userName: oldName})

// 搜索
export const search = ( val ) =>  $fetch('post','search', {val})

// 获取单个video数据
export const singleVideoData = (videoId) => $fetch('post','getVideoById', {videoId})

// 获取评论
export const getVideoComment = (videoId) => $fetch('post','getVideoComment', {videoId})


// 初始化单个video的like信息（判断用户当前的选项）
export const getInitVideoLikeData = ( videoId , userName ) =>$fetch('post','getUserSingleLike',{userName,videoId})

// 提交用户选择like数据
export const postVideoLikeData = (videoId, like, userName, videoName, videoImg, star) => $fetch('post', 'postUserLike', {like,userName,videoName,videoImg, star,videoId})

// 发表评论
export const reportComment = (videoId, userName, content, videoName, avator) => $fetch('post', 'postComment', {videoId,userName,content, videoName,avator})


