export const validator = {
  /**
   * @param {string} path
   * @returns {Boolean}
   */
  isExternal(path: string) {
    return /^(https?:|mailto:|tel:)/.test(path)
  },

  // 手机号码正则表达式
  regCellphone: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,

  /**
   * 验证手机号码
   *
   * @export
   * @param {*} cellphone
   * @returns
   */
  isCellphone(cellphone: string): boolean {
    return validator.regCellphone.test(cellphone)
  },

  // 邮箱地址正则表达式
  regEmail: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,

  /**
   * 验证邮箱地址
   *
   * @export
   * @param {*} email
   * @returns
   */
  isEmail(email: string): boolean {
    return validator.regEmail.test(email)
  }
}
