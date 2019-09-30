<template>
    <div id="video">
        <!--如果其他页面有watch组件，最好带上include属性，不然方法会全部页面都调用-->
        <keep-alive include="home">
            <router-view></router-view>
        </keep-alive>
        <foot v-if="isShow" />
    </div>
</template>

<script>
import foot from "./components/common/foot.vue";
import {mapState,mapMutations} from "vuex";


export default {
    name: 'app',
    components:{
        foot
    },
    data:function(){
        return{
            transitionName: 'slide-left',
            // isShow:true,
        }
    },
    computed:{
        ...mapState(['isShow'])
    }
    ,
    watch: {
        //监听router,to是下一个页面,from当前页面
        $route(to, from) {
            console.log(this.$route.name)
            // console.log(to)
            // console.log(from)
            if(this.$route.name == 'video'){
                this.$store.commit("ShowState",false);
                console.log(this.isShow);
            }else{
                this.$store.commit("ShowState",true);
                console.log(this.isShow);
            }
            // console.log(to.meta.index,from.meta.index)
            if (to.meta.index > from.meta.index) {
                this.transitionName = "slide-left";
            } else {
                this.transitionName = "slide-right";
            }
        }
    }
}
</script>

<style lang="scss">
@import "src/assets/scss/reset.scss";
// html, body, div, span, applet, object, iframe,
// h1, h2, h3, h4, h5, h6, p, blockquote, pre,
// a, abbr, acronym, address, big, cite, code,
// del, dfn, em, img, ins, kbd, q, s, samp,
// small, strike, strong, sub, sup, tt, var,
// b, u, i, center,
// dl, dt, dd, ol, ul, li,
// fieldset, form, label, legend,
// table, caption, tbody, tfoot, thead, tr, th, td,
// article, aside, canvas, details, embed, 
// figure, figcaption, footer, header, hgroup, 
// menu, nav, output, ruby, section, summary,
// time, mark, audio, video {
//   margin: 0px;
//   padding: 0px;
//   border: 0px;
//   font-size: 100%;
//   font: inherit;
//   vertical-align: baseline;
// }
.slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
}
.slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
}
</style>
