import DefaultTheme from 'vitepress/theme'
import CustomLayout from './CustomLayout.vue'
import './custom.css' // 이 줄이 반드시 있어야 합니다.

export default {
  extends: DefaultTheme,
  // 기본 레이아웃을 방금 만든 CustomLayout으로 교체합니다.
  Layout: CustomLayout
}