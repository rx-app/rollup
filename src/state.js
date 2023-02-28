import { observe } from "./observe/index";
import Watcher from "./observe/watcher";

export function initState(vm){
    const opts = vm.$options;
    if(opts.data){
        initData(vm)
    }
    if(opts.computed){
        initComputed(vm)
    }
}
function proxy(vm,target,key){

    Object.defineProperty(vm,key,{  
        get(){
            return vm[target][key];
        },
        set(newValue){
            return vm[target][key]=newValue
        },
    })
}
function initData(vm){
    
    let data = vm.$options.data

    data = typeof data === 'function'?data.call(vm) : data
    vm._data = data
    
    observe(data)

    for(let key in data){
        proxy(vm,'_data',key) //实现 vm.xxx => vm._data.xxx
    }
    
}
function initComputed(vm){
    const computed = vm.$options.computed
    // console.log(computed)
    let watchers = vm._computedWatchers = {}
    for(let key in computed){
        let userDef = computed[key]

        // new Watcher(vm,userDef)
        let fn = typeof userDef === 'function' ? userDef:userDef.get

        watchers[key] = new Watcher(vm,fn,{lazy:true})
        
        defineComputed(vm,key,userDef)
    }
}

function defineComputed(target,key,userDef){
    const getter = typeof userDef === 'function'? userDef : userDef.get
    const setter = userDef.set || (()=>{})
    Object.defineProperty(target,key,{
        get:createComputedGetter(key),
        set:setter,
    })
    
}

function createComputedGetter(key){
    return function(){
        const watcher = this._computedWatchers[key]  //这里的this指向vm
        if(watcher.dirty){
            watcher.evaluate() 
        }
        return watcher.value
    }
}