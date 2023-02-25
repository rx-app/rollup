const strats = {}
const LIFECYCLE = [
    'beforeCreate',
    'created',
]
LIFECYCLE.forEach(hook=>{
    strats[hook] = function(p,c){
        if(c){
            if(p){
                return p.concat(c)
            }else{
                return [c]
            }
        }else{ //这种情况出现在mixin合完之后跟组件合的时候 ， mixin相互合的时候，由于Vue.options是空对象，所以肯定走不到这里
            // debugger   
            return p  
        }
    }
})  

export function mergeOptions(parent,child){
    const options = {}
    for(let key in parent){
        mergeField(key)
    }
    for(let key in child){
        if(!parent.hasOwnProperty(key)){
            mergeField(key)
        }
    }
    function mergeField(key){
        if(strats[key]){
            options[key] = strats[key](parent[key],child[key])
        }else{
            options[key] = child[key] || parent[key]
        }
        
    }
    return options

}