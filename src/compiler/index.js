const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);  // 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;  // 匹配属性
// 第一个分组就是属性的key value 就是 分组3 id=""/分组4 id=''/分组5 id
const startTagClose = /^\s*(\/?)>/;  // <div> <br/>

function parseHTML(html){
    function advance(n){ //把读取过的片段删掉
        html = html.substring(n)
    }
    function parseStartTag(){
        const start = html.match(startTagOpen)
        if(start){
            const match = {
                tagName:start[1],
                attrs:[],
            }
            advance(start[0].length)

            let attr,end
            //如果不是开始标签的结束，则一直匹配  attribute正则匹配 id="app" 
            // end 是 >  或者 />
            // 没匹配到结束标签，并且属性的正则匹配到了 ，说明存在属性attribute ，match里把attr存进去
            while(!( end=html.match(startTagClose) )&& (attr = html.match(attribute)) ){
                advance(attr[0].length)
                match.attrs.push({name:attr[1],value:attr[3] || attr[4] ||attr[5] || true})
            }
            if(end){
                advance(end[0].length)
            }
            console.log(match)
            return match
        }

        


        return false



    }
    while(html){
        let textEnd = html.indexOf('<')
        if(textEnd == 0){  //<开始，说明是开始标签或者结束标签
            const startTagMatch = parseStartTag()
            if(startTagMatch){  //标签节点截取完毕 startTagMatch 是 <div id='aaa'>
                console.log(html)
                continue 
            }
            // break  这个break是调试用的，让while只执行一次
        }
        if(textEnd>0){
            let text = html.substring(0,textEnd)
            if(text){

            }

            break
        }
    }
}



export function complileToFunction(template){
    // 1.template -> ast 语法树
    // 2.生成render函数（render函数返回虚拟dom）
    console.log(template)

    let ast = parseHTML(template)
}