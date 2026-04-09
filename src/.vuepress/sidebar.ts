import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "代码笔记",
      icon: "code",
      prefix: "code/",
      link: "code/",
      children: "structure"
    }
  ],
  "/code/": [
    "",
    {
      text: "java",
      icon: "fab:java",
      prefix: "java/",
      link: "java/",
      // 自动生成侧边栏
      children: "structure"
    },
    {
      text: "Python",
      icon: "fab:python",
      prefix: "python/",
      link: "python/",
      children: "structure"
    }
  ]
});
