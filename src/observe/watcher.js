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
        queueWatcher(this)
        // 去重 防止多次重复渲染
    }
    run(){
        console.log('run')
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
    flushQueue.forEach(q=>q.run()) // 在刷新的过程中可能还有新的watcher，重新放到queue中

    
}

function queueWatcher(watcher){
    let id = watcher.id
    if(!has[id]){
        queue.push(watcher)
        has[id] = true
        // 不管update执行多少次，只执行一轮刷新操作
        if(!pending){
            nextTick(reflushSchedulerQueue, 0);
            pending = true
        }
    }
    
}

let callbacks = []
let waiting = false
function reflushCallbacks(){
    waiting = false
    let cbs = callbacks.slice(0)
    callbacks = []
    cbs.forEach(cb=>cb()) //按照顺序依次执行
}

// nextTick 没有直接使用某个api 而是采用优雅降级的方式
// 内部先采用的是promise (ie不兼容) Mutationobserver(h5的api) 可以考虑ie专享的 setImmediate   最后setTimeout
let timeFunc
if(Promise){
    timeFunc = ()=>{
        Promise.resolve().then(reflushCallbacks)
    }
}else if(MutationObserver){
    let observer = new MutationObserver(reflushCallbacks)
    let textNode = document.createTextNode(1)
    observer.observe(textNode,{characterData:true})
    timeFunc = ()=>{
        textNode.textContent = 2
    }
}else if(setImmediate){
    timeFunc = ()=>{
        setImmediate(reflushCallbacks)
    }
}else{
    timeFunc = ()=>{
        setTimeout(reflushCallbacks, 0)
    }
}
export function nextTick(cb){
    callbacks.push(cb)  //维护nextTick中的callback函数
    if(!waiting){
        // setTimeout(() => {
        //     reflushCallbacks()//最后一起刷新
        // }, 0);
        timeFunc()
        waiting = true
    }
}


export default Watcher