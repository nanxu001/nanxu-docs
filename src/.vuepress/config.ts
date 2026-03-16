import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Nanxu",
  description: "Nanxu 的个人空间",

  theme,

  port: 9000

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
