/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API: 'http://localhost:3000/'
    readonly YMAPS_API: 'https://geocode-maps.yandex.ru/1.x/'
    readonly YMAPS_API_KEY: ''
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
