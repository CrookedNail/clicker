import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import url from 'url'


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', 'scss'],
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/style/variables.scss"; @import "@/style/style.scss";`,
            },
        },
    },
    server: {
        host: '0.0.0.0'
    }
})
