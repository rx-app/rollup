// h()  _c()
export function createElementVnode(vm,tag,data={},...children){
    data = data || {} //??? 默认参数不生效
    let key = data.key
    if(key){
        delete data.key
    }
    return vnode(vm,tag,key,data,children)
}

// _v()
export function createTextVnode(vm,text){
    return vnode(vm,undefined,undefined,undefined,undefined,text)
}

function vnode(vm,tag,key,data, children,text){
    return {
        vm,
        tag,
        key,
        data,
        children,
        text,
    }
}

export function isSameVnode(vnode1,vnode2){
    return vnode1.tag === vnode2.tag && vnode1.key === vnode2.key
}
