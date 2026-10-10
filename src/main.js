import { mount } from 'svelte'
// لود فونت رسمی وزیرمتن نسخه اعداد فارسی (Vazirmatn FD) به صورت کاملاً محلی
import 'vazirmatn/misc/Farsi-Digits/Vazirmatn-FD-font-face.css'
import './app.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
