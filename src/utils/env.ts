const env = process.env

env.API_BASE = process.env.VUE_APP_API_BASE as string

// export const BASE_URL = import.meta.env.BASE_URL as string

// export const isDev = import.meta.env.DEV as boolean

// export const MODE = import.meta.env.MODE as string

// export const isProd = import.meta.env.PROD as boolean

// const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
// const IS_DEV = ['development'].includes(process.env.NODE_ENV)

export { env }
