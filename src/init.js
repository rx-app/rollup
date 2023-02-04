import { initState } from "./state";

export function initMixin(Vue){  //为了把Vue传过来
    
    Vue.prototype._init = function(options){
        const vm = this;
        vm.$options = options; //这里第一步的时候先保存下来，方便后面拿，这样就不需要在每个函数中都传递一下了

        initState(vm)

    }
}


