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


const strats = {}
const LIFECYCLE = [
    'beforeCreate',
    'created',
]
LIFECYCLE.forEach(hook=>{
    strats[hook] = function(p,c){
        if(c){
            if(p){
                return p.concat(c)
            }else{
                return [c]
            }
        }else{
            return p
        }
    }
})  

Vue.options = {}
function mergeOptions(parent,child){
    const options = {}
    for(let key in parent){
        mergeField(key)
    }
    for(let key in child){
        if(!parent.hasOwnProperty(key)){
            mergeField(key)
        }
    }
    function mergeField(key){
        if(strats[key]){
            options[key] = strats[key](parent[key],child[key])
        }else{
            options[key] = child[key] || parent[key]
        }
        
    }
    return options

}
Vue.mixin = function(mixin){
    this.options = mergeOptions(this.options,mixin)
    return this
}



export default Vue