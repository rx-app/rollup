import { isSameVnode } from "."

export function createElm(vnode){ 
    let {tag,data,children,text} = vnode
    if(typeof tag === 'string'){ // 标签 ，文本节点这里是undefind
        vnode.el = document.createElement(tag) //把真实节点挂载到vnode下，后续如果修改了属性
        patchProps(vnode.el,{},data) //处理属性节点
        children.forEach(child=>{
            vnode.el.appendChild(createElm(child))
        })
    }else{
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
export function patchProps(el,oldProps,props){
    let oldStyles = oldProps.style || {}
    let newStyles = props.style || {}
    for(let key in oldStyles){  // 如果这个样式旧节点有，但是新节点没有，需要删除
        if(!newStyles[key]){
            el.style[key] = ''  
        }
    }

    for(let key in oldProps){  // 如果这个属性旧节点有，但是新节点没有，需要删除
        if(!props[key]){  
            el.removeAttribute(key)
        }
    }

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

    }else{
        // 1.两个节点不是同一个节点  直接删除老的换上新的  （没有比对了）
        // 2.两个节点是同一个节点 (判断节点的tag和 节点的key)  比较两个节点的属性是否有差异 （复用老的节点，将差异的属性更新）
        // 3.节点比较完毕后就需要比较两人的儿子

        return patchVnode(oldVnode,vnode)
    }
}

function patchVnode(oldVnode,vnode){
    // 不是相同的节点
    if( !isSameVnode(oldVnode,vnode) ){
        let el = createElm(vnode)
        oldVnode.el.parentNode.replaceChild(createElm(vnode),oldVnode.el )
        return el
    }

    // 是相同的节点，且是文本节点
    let el = vnode.el = oldVnode.el
    if(!oldVnode.tag){//undefind的情况，说明是文本，文本节点tag是undefind
        if(oldVnode.text !== vnode.text){ 
            el.textContent = vnode.text
        }
    }

    // 是相同的节点，且是标签
    patchProps(el,oldVnode.data, vnode.data)
    // 比较儿子
    let oldChildren = oldVnode.children || []
    let newChildren = vnode.children || []

    if(oldChildren.length>0 && newChildren.length>0){
        // 完整的diff算法 需要比较两个人的儿子
    }else if(newChildren.length>0){ //老的没有，新的有
        
        mountChildren(el,newChildren)
    }
    return el
}

function mountChildren(el,newChildren){
    for(let i =0;i<newChildren.length;i++){
        let child = newChildren[i]
        el.appendChild(createElm(child))
    }
}