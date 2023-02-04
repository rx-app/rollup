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
    Object.defineProperty(target,key,{
        get(){
            console.log('get')
            return value
        },
        set(newValue){
            console.log('set')
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