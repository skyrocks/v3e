declare module '*.json'
declare module '*.png'
declare module '*.jpg'
declare module 'uuid'
declare module 'nprogress'
declare module '*.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}
// declare module '*.scss' {
//   const content: any
//   export default content
// }
