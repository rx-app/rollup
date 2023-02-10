import { parseHTML } from "./parse"

function genProps(attrs){
    // debugger
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        let attr=attrs[i]
        if(attr.name==='style'){
            // color:red => {color:'red'}
            let obj = {}
            attr.value.split(';').forEach(item=>{
                let [key,value] = item.split(':')
                obj[key] = value
            })
            attr.value = obj
        }
       
        str+=`${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0,-1)}}`
}

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ asdsadsa }}  匹配到的内容就是我们表达式的变量
function gen(node){
    if(node.type === 1){ //元素节点
        return codegen(node)
    }else{
        // 文本
        let text = node.text
        if(!defaultTagRE.test(text)){
            return `_v(${JSON.stringify(text)})`
        }else{
            let tokens = []
            let match;
            defaultTagRE.lastIndex = 0
            let lastIndex = 0
            while(match = defaultTagRE.exec(text)){
                let index = match.index;
                if(index > lastIndex){
                    tokens.push( JSON.stringify( text.slice(lastIndex,index) ) )
                }
                tokens.push(`_s(${match[1].trim()})`)
                lastIndex = index + match[0].length
            }
            if(lastIndex<text.length){
                tokens.push( JSON.stringify( text.slice(lastIndex) ) )
            }
            return `_v(${tokens.join('+')})`
        }

        
    }
}

function genChidren(children){
    return children.map( child=>gen(child) ).join(',')
}

function codegen(ast){
    // debugger
    let code = `_c('${ast.tag}',${ast.attrs.length>0?genProps(ast.attrs):'null'},${ast.children.length>0?genChidren(ast.children):''})`
    return code
}
export function complileToFunction(template){
    // 1.template -> ast 语法树
    let ast = parseHTML(template)
    
    // 2.生成render函数（render函数返回虚拟dom）
    let code = codegen(ast)
    code = `with(this){return ${code}}`
    let render = new Function(code)

    return render


  
    

    
}