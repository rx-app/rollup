import Dep from "./observe/dep";
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
        if(Dep.target){  
            watcher.depend()  //让这个computed依赖的属性对渲染watcher再进行收集，这样页面上假如只用了计算属性，而这个计算属性依赖的值修改了（但是这个值并没有写在页面中），可以让页面也能重新渲染
            // 计算属性watcher的fn只触发计算属性值的重新计算，并不触发页面的重新渲染，页面的重新渲染由依赖的属性dep里存储的watcher去触发
        }
        return watcher.value
    }
}