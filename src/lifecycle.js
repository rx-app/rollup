import { createElementVnode, createTextVnode } from "./vdom"

function createElm(vnode){ 
    let {tag,data,children,text} = vnode
    if(typeof tag === 'string'){ // 标签 ，文本节点这里是undefind
        vnode.el = document.createElement(tag) //把真实节点挂载到vnode下，后续如果修改了属性
        patchProps(vnode.el,data) //处理属性节点
        children.forEach(child=>{
            vnode.el.appendChild(createElm(child))
        })
    }else{
        vnode.el = document.createTextNode(text)
    }
}
function patchProps(el,props){
    for(let key in props){
        if(key == 'style'){
            for(let styleName in props.style){
                el.style[styleName] = props.style[styleName]
            }
        }
        el.setAttribute(key,props[key])
    }
}

function patch(oldVnode,vnode){
    const isRealElement = oldVnode.nodeType

    if(isRealElement){
        const elm = oldVnode

        const parentElm = elm.parentNode
        let newElement =  createElm(vnode)
        console.log(newElement)
    }else{//旧节点是个虚拟dom
        //  diff算法
    }
}

export function initLifecycle(Vue){
    Vue.prototype._update = function(vnode){
        const vm = this;
        const el = vm.$el;
        console.log(vnode,el)


        // patch 既有初始化共功能，又有更新的逻辑
        patch(el,vnode)
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
        return JSON.stringify(value)
    }
    Vue.prototype._render = function(){
        const vm = this
        return vm.$options.render.call(vm)

    }
}


export function mountComponent(vm,el){
    vm.$el = el
    // 1.调用render方法产生虚拟节点 虚拟DOM
    vm._update( vm._render() )   

    // 2.根据虚拟DOM产生真实DaL



    // 3.插入到e1元素中

}

// vue核心流程 1) 创造了响应式数据2) 模板转换成ast语法树// 3)将ast语法树转换了render函数 4)后续每次数据更新可以只执行render函数(无需再次执行ast转化的过程)
// render函数会去产生虚拟节点《使用响应式数据)
// 根据生成的虚拟节点创造真实的DOM