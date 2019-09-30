<template>
    <section @touchmove="scroll" :style="{'margin-bottom':'0.7rem'}">
        <!--这个是为了让数据获得才显示，不然会报错-->
        <template v-if="lists">
            <!--头部-->
            <div class="top">
                <div @click="back()" class="back">
                    <i class="el-icon-back"></i>
                    返回
                </div>
                <img v-lazy="baseUrl+lists.img+'.png'" alt="">
                <div class="video-title">
                    <div>
                        <h1>{{lists.name}}</h1>
                    </div>
                    <div class="video-font">
                        <div class="video-star">{{lists.star}}</div>
                        <div>
                            <!--星星-->
                            <div class="starList" :style="{'background-position-y':-15*(10-lists.star).toFixed(0)+'px'}"></div>
                            <div class="score">
                                {{likeTotalLength}}人评分/{{pageNeedComments.length}}条评论
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--文字简介-->
            <div class="video-text">
                <div>
                    <h1>时长：{{lists.timelong}}</h1>
                    <h1>类型：{{lists.type}}</h1>
                    <h1>上映时间：{{lists.time1+"("+lists.country+")"}}</h1>
                    <h1>主演：{{lists.actors}}</h1>
                </div>
                <div :style="{'color':'#b7b7b7'}">剧情简介</div>
                <div class="introduction">{{lists.detail}}</div>
                <div :style="{'text-indent': '2em'}">{{lists.detail}}</div>
                <div class="video-like">
                    <template v-if="userName==''||!userName">
                        <div class="like" @click="likeNeedLogin">喜欢</div>
                        <div class="like" @click="likeNeedLogin">讨厌</div>
                        <!-- <p>登录后才可选择！</p> -->
                    </template>
                    <template v-else-if="likes">
                        <!--这样写才有效-->
                        <div :class="[ likes == 1 ? likeActive : likeDisable,likeCls]">喜欢</div>
                        <div :class="[ likes == 2 ? likeActive : likeDisable,likeCls]">不喜欢</div>
                    </template>
                    <template v-else>
                        <div @click="like(1)" class="like">喜欢</div>
                        <div @click="like(2)" class="like">不喜欢</div>
                    </template>
                </div>
            </div>
            <!--评论-->
            <div class="video-comments">
                <h1 :style="{'color':'#b7b7b7'}">评论({{pageNeedComments.length}})</h1>
                <li :key="comment.id" v-for="comment in comments" :style="{'margin-top':'0.2rem'}">
                    <template v-if="comment.avator != '' ">
                        <div class="avator">
                            <img v-lazy="baseUrl+ comment.avator +'.png' " alt="">
                        </div>
                    </template>
                    <template v-else>
                        <div class="avator">
                            {{comment.userName.charAt(0)}}
                        </div>
                    </template>
                    <div class="comments_detail">
                        <h4> {{comment.userName}}</h4>
                        <p> {{comment.date}}</p>
                        <div>{{comment.content}}</div>
                    </div>
                </li>
            </div>
            <!--翻页-->
            <section class="page">
                <!--transition过渡组件-->
                <transition name="page-scale">
                    <div @click="goPage(1)" v-if="(commentsPageLength > 1) && page > 1">首页</div>
                </transition>
                <transition name="page-scale">
                    <div @click="prevPage()" v-if="page >= 2">上一页</div>
                </transition>
                <transition name="page-scale">
                    <div @click="nextPage()" v-if="page < commentsPageLength" >下一页</div>
                </transition>
                <transition name="page-scale">    
                    <div @click="goPage(commentsPageLength)" v-if="page < commentsPageLength">尾页</div>
                </transition>
                <template v-if="commentsPageLength >= 1">
                    <div class="pageNum">{{page}}/{{commentsPageLength}}页</div>
                </template>
                <template v-else>
                    <div class="pageNum">{{commentLoad}}</div>
                </template>
            </section>
        </template>
        <!--写评论-->
        <section v-move class="fixed_comment">
            <template v-if="userName && userName != ''">
                <input type="text" v-model="comment" @click="resetScrollTop" @keyup.enter="report" name="comment" placeholder="评论">
                <button @click="report">评论</button>
            </template>
            <template v-else>
                <input type="text" v-model="comment" name="comment" placeholder="登陆后才可以评论哟！" readonly>
                <button class="disabled">评论</button>
            </template>
        </section>
    </section>
</template>                       

<script>
import {mapState,mapActions} from 'vuex'
import {url,singleVideoData,getVideoComment,getInitVideoLikeData,postVideoLikeData,reportComment,checkUser} from '../data/fetchData.js'

export default {
    name:'detail',
    data:function(){
        return{
            lists: null,
            comments: '',
            pageNeedComments:'',
            likes: '',
            star:'',
            baseUrl:url + '/images/',
            likeTotalLength:0,
            loading: false,
            comment: '',
            likeActive: 'like_active',
            likeCls: 'like',
            likeDisable: 'likeDisable',
            scrollTop:200,
            page:1,
            commentLoad:'评论正在加载中......',
            userName: localStorage.user,
            isShow:false,
        }
    },
    directives:{
        move:{
            inserted(el){
                document.body.appendChild(el)
            },
            unbind(el){
                document.body.removeChild(el)
            }
        }
    },
    computed:{
        ...mapState([
            'userInfo',
            'meCommentDatas'
        ]),
        comment_allow(){
            //localStorage等同于cookie
            return localStorage.user?true:false
        },
        avator(){
            return localStorage.avator
        },
        commentsPageLength(){
            //Math.ceil()执行向上舍入，即它总是将数值向上舍入为最接近的整数
            return Math.ceil(this.pageNeedComments.length/5)
        }
    },
    mounted(){
        this.initData()
        this.$store.commit("ShowState",false)
        console.log('ID1:'+this.$route.params.id);
    },
    watch:{
        // 如果路由有变化，会再次执行该方法
        '$route':'initData'
    },
    methods:{
        async initData () {
            this.loading = true
            console.log(this.loading)
            // 获取video的ID（地址栏）
            var routerId = this.$route.params.id;
            var userName = this.userName;
            console.log("routerId:"+routerId)
            console.log("userName:"+userName)
                setTimeout(()=>{
                    this.loading = false;
                },500)
            await singleVideoData(routerId).then(res =>  {
                var data = res.data
                console.log(data[0],'lists')
                if(data[0].length == 0){
                    //toast插件
                    this.$toast({
                        icon:'fail',
                        message: '影片不存在',
                        success:()=>{
                            this.$router.push({path:'/'})
                        }
                    })
                }
                this.lists = data[0][0];
                console.log(this.lists);
                // 喜欢的数量
                var likeLength = data[1][0]["count(*)"];
                // 该video总的评价数量
                var likeTotalLength = data[2][0]["count(*)"];
                this.likeTotalLength = likeTotalLength
                if (likeTotalLength > 0 && likeLength >= 0) {
                    this.star = likeLength / likeTotalLength * 10
                }
            })
            .catch(e => {
                this.loading = false;
                this.$toast({
                    icon:'fail',
                    message: e.message
                })
            }) 
            
            // 获取评论
            await getVideoComment(routerId).then( res =>  {
                this.comments = res.data.slice(0,5)
                this.pageNeedComments = res.data
                this.commentLoad = '暂时没有相关评论.......'
            }).catch(e => {
                this.$toast({
                    icon:'fail',
                    message: e.message
                }) 
            })   
            setTimeout(()=>{
                this.loading = false;
            },500)
            if(userName !== '' || !userName){
                // 获取like参数
                await getInitVideoLikeData(routerId ,userName).then(res =>  {
                    this.likes = res.data[0] ? res.data[0]['iLike'] : null 
                }).catch(e => {
                    this.$toast({
                        icon:'fail',
                        message: e.message
                    }) 
                })  

            }
        },
        // 点击like操作
        like (likeData) {
            // 提交like信息
            postVideoLikeData(
                    this.$route.params.id,
                    likeData,
                    this.userName,
                    this.lists.name,
                    this.lists.img,
                    this.lists.star
                ).then(data=>{
                    console.log('data',data)
                    if (likeData == 1) {
                        this.likes = 1
                        this.$toast({
                            icon:'success',
                            message:'标记为喜欢'
                        }) 
                    } else if (likeData == 2) {
                        this.likes = 2 
                        this.$toast({
                            icon:'success',
                            message:'标记为不喜欢'
                        })
                    }
                    //更新数据
                    this.initData(); 
            }).catch(e=>{
                this.$toast({
                    icon:'fail',
                    message:e.message,
                    success:()=>{
                        //跳转页面
                        if(e.code == 404) this.$router.push({path:'/login'});
                        localStorage.clear()                   
                    }
                })   
            })
        },
        // 监听滚动，动态更新scrollTop
        scroll(){
            window.onscroll = function(){
                this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop
            }
            this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop
        },
        // 评论后滚动到底部
        scrollToBottom () {       
            var scrollHeight = document.documentElement.scrollHeight;
            console.log(scrollHeight)
            scrollTo(0,scrollHeight);
        },
        resetScrollTop(){
            // document.body.scrollTop = document.documentElement.scrollTop = document.body.scrollHeight + 600;
        },
        date(x, y){
                var z = {
                y: x.getFullYear(),
                M: x.getMonth() + 1,
                d: x.getDate(),
                h: x.getHours(),
                m: x.getMinutes(),
                s: x.getSeconds()
            };
            return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function(v) {
                return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2))
            });
        },
        // 发表评论
        report () {
            if (this.comment == '') {
                this.$toast({
                    icon:'fail',
                    message:'请输入评论内容'
                })  
                this.comment = '';
                return
            }
            var date = this.date(new Date(), 'yyyy-M-d h:m:s')
            var avator = this.avator == null ? '' : this.avator
            reportComment(this.$route.params.id, this.userName,this.comment,this.lists.name,avator).then( data=> {
                console.log(data)
                    this.pageNeedComments.push({
                        "userName": localStorage.getItem('user'),
                        "date": date,//现在由服务端处理
                        "content": this.comment,
                        "avator": avator
                    });
                    this.goPage(Math.ceil(this.pageNeedComments.length / 5))
                    this.$toast({
                        icon:'success',
                        message:'评论成功'
                    })  
                    this.comment = ''
                    this.$nextTick(() => {
                        this.scrollToBottom()
                    })
            }).catch(e=>{
                this.$toast({
                    icon:'fail',
                    message:e.message,
                    success:()=>{
                        if(e.code == 404) this.$router.push({path:'/login'});localStorage.clear()                   
                    }
                }) 
                this.comment = ''                   
            })
        },
        nextPage(){
            if (this.page != this.commentsPageLength) {
               this.page++
            }
           this.comments = this.pageNeedComments.slice((this.page-1)*5,this.page*5)
        },
        prevPage(){
           if (this.page != 1) {
               this.page--
           }
           this.comments = this.pageNeedComments.slice((this.page-1)*5,this.page*5)     
        },
        goPage(page){
           this.page = page
           this.comments = this.pageNeedComments.slice((page-1)*5,page*5) 
        },
        likeNeedLogin(){
            this.$toast({
                icon:'fail',
                message:'请先登录！'
            }) 
        },
        back(){
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/scss/detail.scss';
</style>

