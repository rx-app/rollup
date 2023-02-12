import { createElementVnode, createTextVnode } from "./vdom"

export function initLifecycle(Vue){
    Vue.prototype._update = function(vnode){
        console.log('update',vnode)
    }
    // _c('div',{},...children)
    Vue.prototype._c = function(){
       return createElementVnode(this,...arguments)
    }
    // _v(text)
    Vue.prototype._v = function(){
        return createTextVnode(this,...arguments)
    }
    Vue.prototype._s = function(value){
        // return value  //??? 这个地方直接写return value，不用 JSON.stringify 似乎也可以
        if(typeof value !== 'object'){
            return value
        }
        return JSON.stringify(value)
    }
    Vue.prototype._render = function(){  //返回一个vnode
        return this.$options.render.call(this)  //这里的render函数是complileToFunction的返回值
    }
}


export function mountComponent(vm,el){
    // 1.调用render方法产生虚拟节点 虚拟DOM
    vm._update( vm._render() )   

    // 2.根据虚拟DOM产生真实DaL



    // 3.插入到e1元素中

}

// vue核心流程 1) 创造了响应式数据2) 模板转换成ast语法树// 3)将ast语法树转换了render函数 4)后续每次数据更新可以只执行render函数(无需再次执行ast转化的过程)
// render函数会去产生虚拟节点《使用响应式数据)
// 根据生成的虚拟节点创造真实的DOM