import { initGlobleAPI } from "./globalAPI"
import { initMixin } from "./init"
import { initLifecycle } from "./lifecycle"
import { nextTick } from "./observe/watcher"

function Vue(options){
    this.$options = options
    this._init(options)
}

Vue.prototype.$nextTick = nextTick
initMixin(Vue)
initLifecycle(Vue)
initGlobleAPI(Vue)



export default Vue