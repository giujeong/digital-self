import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 빌드 시점 날짜(한국 시간)를 footer의 업데이트 날짜로 자동 주입
const kst = new Date(Date.now() + 9 * 60 * 60 * 1000)
const buildDate = kst.toISOString().slice(0, 10).replace(/-/g, '.')

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
})
