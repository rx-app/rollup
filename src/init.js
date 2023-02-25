import { complileToFunction } from "./compiler";
import { callHook, mountComponent } from "./lifecycle";
import { initState } from "./state";
import { mergeOptions } from "./utils";

export function initMixin(Vue){  //为了把Vue传过来
    
    Vue.prototype._init = function(options){
        const vm = this;
        vm.$options = mergeOptions(this.constructor.options,options ) ; //这里第一步的时候先保存下来，方便后面拿，这样就不需要在每个函数中都传递一下了
        // console.log(vm.$options)
        callHook(vm,'beforeCreate')
        // 初始化状态
        initState(vm)
        callHook(vm,'created')

        if(options.el){
            vm.$mount(options.el)
        }
    }
    Vue.prototype.$mount = function(el){
        const vm = this
        el = document.querySelector(el)
        let ops = vm.$options
        if(!ops.render){
            let template
            if(!ops.template && el){
                template = el.outerHTML
            }else{
                if(el){ // ??? 为什么还要判断el 是不是写错了
                    template = ops.template
                }
            }
            // console.log(template)
            if(template){
                const render = complileToFunction(template)
                ops.render = render
            }
        }
        // console.log( ops.render )
        mountComponent(vm,el)
    }
}


