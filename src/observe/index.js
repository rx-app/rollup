import { newArrayProto } from "./array"

class Observer{
    
    constructor(data){
        data.__ob__ = this  // 这里是是为了把observeArray这个方法传递过去
        if(Array.isArray(data)){
            data.__proto__ = newArrayProto  //如果是数组，先重写原型链上的push，ushift之类的方法。
            this.observeArray(data)
        }else{
            this.walk(data)
        }     
    }
    walk(data){
        Object.keys(data).forEach(key=>{
            return defineReactive(data,key,data[key])
        })
    }
    observeArray(data){
        data.forEach(item=>observe(item))
    }
}
export function defineReactive(target,key,value){
    observe(value) //如果是嵌套了对象，再劫持一遍 （是否对象的判断在observe函数里存在了，所以这里无需判断）
    Object.defineProperty(target,key,{
        get(){
            // console.log('getkey',key)
            return value
        },
        set(newValue){
            // console.log('setkey',key)
            if(newValue === value) return
            observe(newValue)  // 比如： vm.address = {num:20}
            value = newValue
        },
    })
}
export function observe(data){
    if(typeof data !== 'object' || data == null){
        return 
    }

    return new Observer(data)
    console.log(data)
}