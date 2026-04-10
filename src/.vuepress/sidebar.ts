import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/code/java/": [
    {
      text: "Java",
      icon: "fab:java",
      prefix: "",
      link: "",
      // 自动生成侧边栏
      children: "structure"
    },
  ],
  "/code/python/": [
    "",
    {
      text: "基础教程",
      icon: "fab:python",
      prefix: "guide/",
      link: "guide/",
      children: "structure"
    },
  ],
  "/code/": [
    "",
    {
      text: "Java",
      icon: "fab:java",
      prefix: "java/",
      link: "java/",
      children: "structure"
    },
    {
      text: "Python",
      icon: "fab:python",
      prefix: "python/",
      link: "python/",
      children: ["guide/"]
    }
  ],
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
});
