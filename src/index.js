import { complileToFunction } from "./compiler"
import { initGlobleAPI } from "./globalAPI"
import { initMixin } from "./init"
import { initLifecycle } from "./lifecycle"
import { initStateMixin } from "./state"

function Vue(options){
    this.$options = options
    this._init(options)
}


initMixin(Vue)
initLifecycle(Vue)
initGlobleAPI(Vue)
initStateMixin(Vue)


// ------------------测试代码-------------------
let render1 = complileToFunction(`<div>{{name}}</div>`)
let vm1 = new Vue({data:{name:'zf'}})
let prevVnode = render1.call(vm1)

let render2 = complileToFunction(`<span>{{name}}</span>`)
let vm2 = new Vue({data:{name:'zf'}})
let nextVnode = render2.call(vm2)

// console.log(prevVnode,nextVnode)


export default Vue