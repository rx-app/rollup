import Dep, { popTarget, pushTarget } from "./dep"

let id = 0

class Watcher{
    constructor(vm,exprOrFn,options,cb){
        this.id = id++
        this.renderWatcher = options//渲染watcher

        if(typeof exprOrFn == 'string' ){  // exp :'firstname'  fn: ()=>vm.firstname
            this.getter = function(){
                return vm[exprOrFn]
            }
        }else{
            
            this.getter = exprOrFn
        }
        
        this.deps= []
        this.depsId=new Set()
        this.lazy = options.lazy
        this.cb = cb
        this.dirty = this.lazy
        this.vm = vm
        this.user = options.user

        this.value = this.lazy ?undefined : this.get() //有lazy属性说明这个是computed watcher，一开始不执行get（）函数 ， 因为computed 的new watcher阶段只是生成watcher，并不是取值，渲染watcher一上来就需要渲染的
    }
    addDep(dep){
        let id = dep.id
        if(!this.depsId.has(id)){
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this)
        }
    }
    evaluate(){
        this.value  = this.get() 
        this.dirty = false
    }
    get(){
        pushTarget(this) //Dep.target = this  
        let value = this.getter.call(this.vm)
        popTarget()// Dep.target = null
        return value
    }
    depend(){
        let i = this.deps.length  //这里面的this.deps存的是计算属性的依赖（firstName和lastName）
        while(i--){
            this.deps[i].depend() //调Dep的depend会让dep和watcher相互收集依赖
        }
    }
    update(){//重新渲染
        if(this.lazy){  // 说明是计算属性的watcher
            this.dirty = true 
        }else{
            queueWatcher(this)
            // 去重 防止多次重复渲染
        }
        
    }
    run(){
        // console.log('run')
        let oldValue = this.value
        let newValue = this.get()
        if(this.user){
            this.cb.call(this.vm,newValue,oldValue)
        }
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