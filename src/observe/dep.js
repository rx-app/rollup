let id =0 
class Dep{
    constructor(){
        this.id= id++
        this.subs=[] //当前存放当前属性对应的watcher有哪些
    }
    depand(){
        // this.subs.push(Dep.target)  //这样写会重复添加watcher
        // debugger
        Dep.target.addDep(this)
    }
    addSub(watcher){
        this.subs.push(watcher)
    }
    notify(){
        this.subs.forEach(watcher=>watcher.update())
    }
}

Dep.target =null
// Dep.watcher = Dep.target


// 维护成栈 本来是Dep.target = this  是单个的，改成一个栈
let stack = []
export function pushTarget(watcher){
    stack.push(watcher)
    Dep.target = watcher
}
export function popTarget(){
    stack.pop()
    Dep.target = stack[stack.length - 1]
}


export default Dep