export function createElm(vnode){ 
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
    return vnode.el
}
export function patchProps(el,props){
    for(let key in props){
        if(key == 'style'){
            for(let styleName in props.style){
                el.style[styleName] = props.style[styleName]
            }
        }else{
            el.setAttribute(key,props[key])
        }
    }
}

export function patch(oldVnode,vnode){
    const isRealElement = oldVnode.nodeType

    if(isRealElement){
        const elm = oldVnode

        const parentElm = elm.parentNode
        let newElm =  createElm(vnode)
        parentElm.insertBefore(newElm,elm.nextSibling)
        parentElm.removeChild(elm)

        return newElm

    }else{//旧节点是个虚拟dom
        //  diff算法
    }
}