// h()  _c()
export function createElementVnode(vm,tag,data={},...children){
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
