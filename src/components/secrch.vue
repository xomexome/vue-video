<template>
    <section id>
        <!--顶部搜索跳转-->
        <div class="top">
            <i class="el-icon-search"></i>
            <input type="text" v-focus v-model.trim="search" v-on:input="searchResult">
            <router-link to="/" class="all_input">
                取消
            </router-link>
        </div>
        <div class="search_title">
            搜索结果
        </div>
        <template v-if="results.length == 0 &&  search != ''">
            <div class="not_find">没有相关影片</div>
        </template>
        <template v-else>
            <!-- 【appear】 给 transition-group 添加入场效果-->
            <!--
                通过 tag 属性，指定transition-group 渲染 为指定的元素
                若不指定，则默认为渲染为 span 标签
            -->
            <transition-group appear tag="ul" name="slide-in">
                <li v-for="result in results" :key="result.id">
                    <router-link :to="'/video/'+result.id">
                        <img v-lazy="baseUrl+result.img" alt="">
                        <div class="result_name">
                            <p>{{result.name}}</p>
                            <p>{{result.star}}分/{{result.time1}}  </p>
                        </div>
                    </router-link>
                </li> 
            </transition-group>
        </template>
    </section>
</template>

<script>
import {mapState} from "vuex"
import {url,search} from "../data/fetchData.js"
export default {
    name:"search",
    data:function(){
        return{
            search: '',
            results: '',
            baseUrl: url+'/images/'
        }
    },
    directives:{
        focus:{
            inserted(el){
                // 聚焦元素
                el.focus()
            }
        }
    },
    methods:{
        searchResult(){
            if(this.search!=''){
                search(this.search).then(res=>{
                    console.log('res.data');
                    console.log(res.data);
                    this.results=res.data;
                }).catch(err=>{
                    console.log('err');
                    console.log(err.data);
                    this.results=err.data;
                })
            }else{
                this.results='';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.top{
    padding: 0.15rem 0;
    width: 100%;
    height: 0.6rem;
    background-color: rgba(61, 185, 61, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    input{
        width: 89%;
        height: 0.4rem;
        //去除input边框和去除当点击input框时显示的边框
        border: none;
        outline:none;
        border-radius:25px;
        padding-left: 0.6rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    i{
        position: absolute;
        font-size: 16px;
        left: 0.2rem;
    }
    a{
        font-size: 14px;
        text-decoration:none;
        color: white;
        margin-left: 0.1rem;
    }
}
.search_title{
    background: #f2f2f2;
    padding:0.1rem 0;
    padding-left: 0.2rem;
    color: #333
}
.not_find{
    text-align: center;
    font-size: 16px;
    margin-top: 0.1rem;
}
ul{
        li{
            padding:0.12rem 0.2rem;
            &+li{
                border-top:1px solid #eee;
            }
            a{
                font-size: 14px;
                color: #333;
                display: flex;
                align-items: center;
                img{
                  width: 0.7rem;
                  height: 1rem;
            }
            div{
                margin-left: 0.2rem;
                p{
                    margin:0.05rem 0;
                }
            }
        }
    }
}
</style>
 