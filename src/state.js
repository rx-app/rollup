import { observe } from "./observe/index";

export function initState(vm){
    const opts = vm.$options;
    if(opts.data){
        initData(vm)
    }
}
function initData(vm){
    debugger
    let data = vm.$options.data

    data = typeof data === 'function'?data.call(vm) : data
    vm._data = data
    debugger
    observe(data)
    
}