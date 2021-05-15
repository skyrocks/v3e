export function log(params: any) {
  return function (target: any, funName: any, desc: any) {
    // 接收参数为装饰器传递的参数
    console.log('params:', params)
    // 接收参数为装饰器装饰器方法所在的类
    console.log('target:', target)
    // 接收参数为装饰器装饰器的方法名
    console.log('funName:', funName)
    // 接收参数为装饰器装饰方法的详细信息
    console.log('desc:', desc)
  }
}
