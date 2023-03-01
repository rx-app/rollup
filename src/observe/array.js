let oldArrayProto = Array.prototype

export let newArrayProto = Object.create(oldArrayProto)

// 数组的变异方法
let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reserve',
    'sort',
    'splice',
] //concate slice 都不会改变原数组

methods.forEach(method=>{
    newArrayProto[method]=function(...args){
        const result = oldArrayProto[method].call(this,...args) //???  this
        
        
        console.log(method)
        let inserted;
        let ob = this.__ob__;
        switch (method) {
                case 'push':
                case 'unshift':
                    inserted = args
                    break;
                case 'splice':  //splice 是第三个参数往后才是插入的内容
                    inserted = args.slice(2)
        
            default:
                break;
        }
        // console.log(inserted) 
        if(inserted ){
            ob.observeArray(inserted)
        }

        ob.dep.notify();
        return result
    }
})