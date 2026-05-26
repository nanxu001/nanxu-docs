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
      icon: "fas:layer-group",
      prefix: "foundation/",
      link: "foundation/",
      children: "structure"
    },
    {
      text: "进阶教程",
      icon: "fas:arrow-trend-up",
      prefix: "advanced/",
      link: "advanced/",
      children: "structure"
    }
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
      children: ["foundation/", "advanced/"]
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
