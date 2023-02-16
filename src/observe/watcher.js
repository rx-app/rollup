import Dep from "./dep"

let id = 0

class Watcher{
    constructor(vm,fn,options){
        this.id = id++
        this.renderWatcher = options//渲染watcher
        this.getter = fn
        this.deps= []
        this.depsId=new Set()
        this.get()
    }
    addDep(dep){
        let id = dep.id
        if(!this.depsId.has(id)){
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this)
        }
    }
    get(){
        Dep.target = this
        this.getter()
        Dep.target = null
    }
    update(){//重新渲染
        // console.log('update')
        // this.get()  
        queueUpdate(this)
        // 去重 防止多次重复渲染
    }
    run(){
        this.get()
    }
    
}

let queue = []
let has = {}
let pending = false; // 防抖

function reflushSchedulerQueue(){
    let flushQueue = queue.slice(0) //复制一份
    

    queue = []
    has = {}
    pending = false
    flushQueue.forEach(q=>q.run())
}

function queueUpdate(watcher){
    let id = watcher.id
    if(!has[id]){
        queue.push(watcher)
        has[id] = true
        // 不管update执行多少次，只执行一轮刷新操作
        if(!pending){
            setTimeout(reflushSchedulerQueue, 0);
            pending = true
        }
    }
    
}



export default Watcher