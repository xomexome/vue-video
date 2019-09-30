<template>
    <section class="home">
        <!--顶部搜索跳转-->
        <div class="top">
            <!-- router-link变成html页面时是a标签 -->
            <router-link to="/secrch" class="secrch_input">
                    <i class="el-icon-search"></i>搜索
            </router-link>
        </div>
        <!--全部-->
        <div class="video_list">
            <div class="video_list_header">
                <h3>全部<span>({{allLength}})</span></h3>
                <router-link to="/all" class="all_input">
                    更多<i class="el-icon-more"></i>
                </router-link>
            </div>
            <!--图片-->
            <ul>
                <li v-for="(list,index) in lists[3]" :key="list.id" v-if="index<10">
                    <router-link :to="'/video/'+list.id" class="movie_input">
                        <div><img v-lazy="baseUrl+list.img+'.png'" alt=""></div>
                        <h3>{{list.name}}</h3>
                        <div>
                            <div class="starList" :style="{'background-position-y':-15*(10-list.star).toFixed(0)+'px'}"></div> 
                            <span>{{list.star}}</span>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
        <!--电影-->
        <div class="video_list">
            <div class="video_list_header">
                <h3>电影<span>({{movieLength}})</span></h3>
                <router-link to="/movie" class="all_input">
                    更多<i class="el-icon-more"></i>
                </router-link>
            </div>
            <!--图片-->
            <ul>
                <li v-for="(list,index) in lists[0]" :key="list.id" v-if="index<10">
                    <router-link :to="'/video/'+list.id" class="movie_input">
                        <div><img v-lazy="baseUrl+list.img+'.png'" alt=""></div>
                        <h3>{{list.name}}</h3>
                        <div>
                            <div class="starList" :style="{'background-position-y':-15*(10-list.star).toFixed(0)+'px'}"></div> 
                            <span>{{list.star}}</span>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
        <!--电视剧-->
        <div class="video_list">
            <div class="video_list_header">
                <h3>电视剧<span>({{tvLength}})</span></h3>
                <router-link to="/tv" class="all_input">
                    更多<i class="el-icon-more"></i>
                </router-link>
            </div>
            <!--图片-->
            <ul>
                <li v-for="(list,index) in lists[1]" :key="list.id" v-if="index<10">
                    <router-link :to="'/video/'+list.id" class="movie_input">
                        <div><img v-lazy="baseUrl+list.img+'.png'" alt=""></div>
                        <h3>{{list.name}}</h3>
                        <div>
                            <div class="starList" :style="{'background-position-y':-15*(10-list.star).toFixed(0)+'px'}"></div> 
                            <span>{{list.star}}</span>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
        <!--综艺-->
        <div class="video_list">
            <div class="video_list_header">
                <h3>综艺<span>({{zyLength}})</span></h3>
                <router-link to="/zy" class="all_input">
                    更多<i class="el-icon-more"></i>
                </router-link>
            </div>
            <!--图片-->
            <ul>
                <li v-for="(list,index) in lists[2]" :key="list.id" v-if="index<10">
                    <router-link :to="'/video/'+list.id" class="movie_input">
                        <div><img v-lazy="baseUrl+list.img+'.png'" alt=""></div>
                        <h3>{{list.name}}</h3>
                        <div>
                            <div class="starList" :style="{'background-position-y':-15*(10-list.star).toFixed(0)+'px'}"></div> 
                            <span>{{list.star}}</span>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
import {url,initHome,getAvator} from "../data/fetchData.js"
import {mapActions,mapState} from "vuex"
export default {
    name:"home",
    components:{

    },
    data:function(){
        return{
            lists:'',
            loading:true,
            baseUrl:url+'/images/'
        }
    },
    computed:{
        allLength(){
            return this.getJsonLength(this.lists[3])
        },
        movieLength(){
            return this.getJsonLength(this.lists[0])
        },
        tvLength(){
            return this.getJsonLength(this.lists[1])
        },
        zyLength(){
            return this.getJsonLength(this.lists[2])
        },
        ...mapState([
            'videoData',
        ]),
    },
    created(){
        if(this.videoData!=null){
            this.lists=this.videoData
        }else{
            this.initData()
        }
    },
    methods:{
        async initData(){
            this.loading=true
            // 首页初始化数据
            await initHome().then(res=>{
                var list=res.data
                this.lists=list
                console.log(list);
                this.$store.dispatch("initVideoData",{
                    initVideoData:list
                })
            }).catch(err=>{
                this.$toast({
                    icon:"fail",
                    message:e.message
                })
            })
            //0.5秒后执行
            setTimeout(()=>{
                this.loading=false
            },500)
        },
        getJsonLength(jsonData){
            var jsonLength=0;
            for(var item in jsonData){
                jsonLength++;
            }
            return jsonLength;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "src/assets/scss/home.scss";
// .top{
//     width: 100%;
//     height: 40px;
//     background-color: rgba(61, 185, 61, 0.9);
//     display: flex;
//     justify-content: center;
//     align-items: center;
// }
// .secrch_input{
//     width: 95%;
//     height: 30px;
//     background-color: white;
//     border:0px solid;
//     border-radius:25px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     text-decoration:none;
//     color: rgba(0, 0, 0, 0.68);
// }
// .all_input{
//     color: rgba(0, 0, 0, 0.68);
//     float:right
// }
// .video_list_header{
//     display: flex;
//     justify-content: space-between;
// }
// .video_list{
//     margin-top: 10px;
//     padding-right:2%;
//     padding-left: 2%;
// }
// h3{
//     border-left: 5px solid #0fce0f;
//     padding-left: 5px
// }
// .movie_input{
//     text-decoration:none;
//     color: black;
// }
// .starList{
//     height: 15px;
//     width: 75px;
//     background: url("../assets/star.png")
// }
</style>
