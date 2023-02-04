class Observer{
    constructor(data){
        this.walk(data)
    }
    walk(data){
        Object.keys(data).forEach(key=>{
            return defineReactive(data,key,data[key])
        })
    }
}
export function defineReactive(target,key,value){
    observe(value) //如果是嵌套了对象，再劫持一遍 （是否对象的判断在observe函数里存在了，所以这里无需判断）
    Object.defineProperty(target,key,{
        get(){
            // console.log('get')
            return value
        },
        set(newValue){
            // console.log('set')
            if(newValue === value) return
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