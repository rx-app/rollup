import Dep from "./dep"

let id = 0

class Watcher{
    constructor(vm,fn,options){
        this.id = id++
        this.renderWatcher = options//渲染watcher
        this.getter = fn

        this.get()
    }
    get(){
        Dep.target = this
        this.getter()
        Dep.target = null
    }
}

export default Watcher