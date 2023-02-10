import { initMixin } from "./init"

function Vue(options){
    this.$options = options
    this._init(options)
}

initMixin(Vue)
initLifecycle(Vue)



export default Vue