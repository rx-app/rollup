import { parseHTML } from "./parse"

export function complileToFunction(template){
    // 1.template -> ast 语法树
    // 2.生成render函数（render函数返回虚拟dom）
    console.log(template)

    let ast = parseHTML(template)
}