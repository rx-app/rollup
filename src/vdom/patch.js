import { isSameVnode } from "."

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

    }else{
        // 1.两个节点不是同一个节点  直接删除老的换上新的  （没有比对了）
        // 2.两个节点是同一个节点 (判断节点的tag和 节点的key)  比较两个节点的属性是否有差异 （复用老的节点，将差异的属性更新）
        // 3.节点比较完毕后就需要比较两人的儿子
        if( !isSameVnode(oldVnode,vnode) ){
            oldVnode.el.parentNode.replaceChild(createElm(vnode),oldVnode.el )
        }
    }
}