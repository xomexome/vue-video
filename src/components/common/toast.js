var Toast={};

Toast.install=function(Vue,options){
    Vue.prototype.$toast=(options)=>{
        var icon =options.icon=='success'?'-check' : '-close'

        if(document.getElementsByClassName('dialog').length) return

        var toastCpl=Vue.extend({
            template: `<section class="dialog">
                            <div class="dialog_wrap aniDialog">
                                <i class="el-icon-circle${icon}"></i>
                                <p>${options.message}</p>
                            </div>
                        </section>`
        })
        var tpl=new toastCpl().$mount().$el;
        document.body.appendChild(tpl);
        setTimeout(function(){
            document.body.removeChild(tpl);
            options.success && options.success()
        },1500)
    }
    var a="asd//"
}

module.exports=Toast