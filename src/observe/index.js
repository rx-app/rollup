import { newArrayProto } from "./array"
import Dep from "./dep"

class Observer{
    
    constructor(data){
        // debugger
        // data.__ob__ = this  // 这里是是为了把observeArray这个方法传递过去

        Object.defineProperty(data,'__ob__',{//这里的__ob__会挂在data下，遍历data的__ob__的时候，又会重新在这个__ob__下再挂一个__ob__，导致死循环
            value:this,
            enumerable:false, //不可枚举，不可遍历 Object.keys获取不到
        })
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
    let dep = new Dep()
    Object.defineProperty(target,key,{
        get(){
            if(Dep.target){
                dep.depend()
            }
            return value
        },
        set(newValue){
            // console.log('setkey',key)
            if(newValue === value) return
            observe(newValue)  // 比如： vm.address = {num:20}
            value = newValue
            dep.notify()
        },
    })
}
export function observe(data){
    if(typeof data !== 'object' || data == null){
        return 
    }
    if(data.__ob__ instanceof Observer){ //observe函数返回的就是一个被属性劫持过后的对象，这里存在data.__ob__其实说明这个data执行过了构造函数，
        return data.__ob__
    }

    return new Observer(data)
    console.log(data)
}