export function initMixin(Vue){  //为了把Vue传过来
    
    Vue.prototype._init = function(options){
        const vm = this;
        vm.$options = options; //这里第一步的时候先保存下来，方便后面拿，这样就不需要在每个函数中都传递一下了

        initState(vm)

    }
}

function initState(vm){
    const opts = vm.$options;
    if(opts.data){
        initData(vm)
    }
}
function initData(vm){
    let data = vm.$options.data

    data = typeof data === 'function'?data.call(vm) : data
    // debugger
    console.log(data)
}
