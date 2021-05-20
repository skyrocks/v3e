module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      //额外的语言特性
      legacyDecorators: true //装饰器@ 配置
    }
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    'prettier/prettier': [
      'error',
      {
        endOfLine: 'lf', //换行符使用 lf
        printWidth: 120, // 超过最大值换行
        useTabs: false, // 缩进不使用tab，使用空格
        tabWidth: 2, // 缩进字节数
        semi: false, // 未尾逗号
        vueIndentScriptAndStyle: false, // vue文件的script标签和Style标签下的内容不需要缩进
        singleQuote: true, // 单引号
        quoteProps: 'as-needed', // 只有在对象属性需要引号时，为其添加双引号
        bracketSpacing: true, // 是否在对象属性添加空格，这里选择是 { foo: bar }
        trailingComma: 'none', // 不要末尾分号
        jsxBracketSameLine: false, // 在jsx中把'>' 不单独放一行
        jsxSingleQuote: false, // 在jsx中不使用单引号代替双引号
        arrowParens: 'avoid', //箭头函数，只有一个参数的时候，不需要括号
        insertPragma: false,
        requirePragma: false,
        proseWrap: 'never', // 使用不换行的折行标准
        htmlWhitespaceSensitivity: 'strict' // 优化html闭合标签不换行的问题
      }
    ],
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/html-self-closing': 'off',
    'vue/custom-event-name-casing': 'off',

    quotes: ['error', 'single'],
    'space-before-function-paren': 'off',
    'comma-dangle': ['error', 'never'],
    'arrow-body-style': 'off'
  }
}
