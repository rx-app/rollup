const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);  // 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;  // 匹配属性
// 第一个分组就是属性的key value 就是 分组3 id=""/分组4 id=''/分组5 id
const startTagClose = /^\s*(\/?)>/;  //  /> 或  >

export function parseHTML(html){
    const ELEMENT_TYPE =1;
    const TEXT_TYPE =3;
    const stack =[]; 
    let currrentParent;
    let root;

    function createASTElement(tag,attrs){
        return {
            tag,
            type:ELEMENT_TYPE,
            children:[],
            attrs,
            parent:null,
        }
    }


    function start(tag,attrs){
        let node = createASTElement(tag,attrs)
        if(!root){
            root = node;
        }
        if(currrentParent){
            node.parent = currrentParent
            currrentParent.children.push(node)
        }
        stack.push(node)
        currrentParent = node
        
        // console.log(tag,attrs,'开始')
    }
    function chars(text){
        text = text.replace(/\s/g,'')
        text && currrentParent.children.push({ //文本直接放到currrentParent
            type:TEXT_TYPE,
            text,
            parent:currrentParent
        })
        console.log(text,'文本')
    }
    function end(tag){
        console.log(tag,'结束')
        let node = stack.pop() // 可以和tag做对比， 进行校验
        currrentParent = stack[stack.length-1]
    }


    function advance(n){ //把读取过的片段删掉
        html = html.substring(n)
    }
    function parseStartTag(){ // 处理类似这种 <div style="color: red;">
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
                match.attrs.push({name:attr[1],value:attr[3] || attr[4] ||attr[5] })
            }
            if(end){ // 匹配到了结束标签 > 或 />  ，代表属性已经提取完了
                advance(end[0].length)  // 结束标签不需要提取什么，直接删除
            }
            // console.log(match)
            return match  //
        }
        return false  //return match说明是开始标签，false说明是结束标签
    }
    while(html){
        let textEnd = html.indexOf('<')
        if(textEnd == 0){  //<开始，说明是 开始标签 或者 结束标签  <div> 或者 </div>
            const startTagMatch = parseStartTag()
            if(startTagMatch){  //标签节点截取完毕 startTagMatch 是 <div id='aaa'>
                start(startTagMatch.tagName,startTagMatch.attrs)
                continue 
            }
            let endTagMatch = html.match(endTag)
            if(endTagMatch){
                end(endTagMatch[1])
                advance(endTagMatch[0].length)
                continue
            }
            // break  这个break是调试用的，让while只执行一次
        }
        if(textEnd>0){  // 剩下的html内容不是以 < 开头
            let text = html.substring(0,textEnd)
            if(text){
                chars(text)
                advance(text.length)
            }
            // break
        }
    }
    return root
    // console.log(root)
}
