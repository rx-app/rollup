// import qs from 'qs'
const qs = require('qs')

let url = 'id=1&name=chenchen'
let p = qs.parse(url)
console.log(p)
// {id:1，name:chenchen}  
let obj = {
    methods: 'query_stu',
    id: 1,
    name: 'chenchen',
}
let res = qs.stringify(obj)
console.log(res)
    //   methods=query_stu&id=1&name=chenchen    这就是我们的传到服务器的url
// export const a = 100;
// export default {a:1}