declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  // 如果有其他环境变量，可以在这里继续添加
  readonly VITE_APP_TITLE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
