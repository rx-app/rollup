import { complileToFunction } from "./compiler"
import { initGlobleAPI } from "./globalAPI"
import { initMixin } from "./init"
import { initLifecycle } from "./lifecycle"
import { initStateMixin } from "./state"
import { createElm, patch } from "./vdom/patch"

function Vue(options){
    this.$options = options
    this._init(options)
}


initMixin(Vue)
initLifecycle(Vue)
initGlobleAPI(Vue)
initStateMixin(Vue)


// ------------------测试代码-------------------
let render1 = complileToFunction(`<ul a="1" style="color:red">
    <li key="a">a</li>
    <li key="b">b</li>
    <li key="c">c</li>
    <li key="d">d</li>
</ul>`)
let vm1 = new Vue({data:{name:'zf'}})
let prevVnode = render1.call(vm1)

let el = createElm(prevVnode)
document.body.appendChild(el)

let render2 = complileToFunction(`<ul a="1" style="color:red">
    <li key="a">a</li>
    <li key="b">b</li>
    <li key="c">c</li>
</ul>`)
let vm2 = new Vue({data:{name:'zf'}})
let nextVnode = render2.call(vm2)

let newEl = createElm(nextVnode)
setTimeout(() => {
    patch(prevVnode,nextVnode)
    // el.parentNode.replaceChild(newEl,el)
}, 1000);


// console.log(prevVnode,nextVnode)


export default Vue