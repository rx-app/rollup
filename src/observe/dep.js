let id =0 
class Dep{
    constructor(){
        this.id= id++
        this.subs=[] //当前存放当前属性对应的watcher有哪些
    }
    depand(){
        this.subs.push(Dep.target)
        // debugger
    }
}

Dep.target =null
// Dep.watcher = Dep.target
export default Dep