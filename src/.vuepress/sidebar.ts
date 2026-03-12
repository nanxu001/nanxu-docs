import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "Nanxu",
      icon: "book",
      prefix: "nanxu/",
      link: "nanxu/",
      children: "structure"
    }
  ],
});
