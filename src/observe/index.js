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
    Object.defineProperties(target,key,{
        get(){
            return value
        },
        set(newValue){
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