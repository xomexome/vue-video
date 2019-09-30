import Vue from "vue"
import Vuex from "vuex"
import actions from "./actions"
import mutations from "./mutations"

Vue.use(Vuex)

var state={
    userIofo:"",
    videoData:null,
    meCommentDatas:null,
    isShow:true
}

export default new Vuex.Store({
    state,
    actions,
    mutations
})