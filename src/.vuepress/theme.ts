import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import sidebar from "./sidebar.js";
import verificationConfig from "./verification.config.js";

export default hopeTheme({
  hostname: "https://www.nanxu.online",

  author: {
    name: "Nanxu",
    url: "https://www.nanxu.online",
    email: "1275454303@qq.com"
  },

  logo: "/logo.png",
  favicon: "/favicon.ico",

  repo: "nanxu001/nanxu-docs",
  repoLabel: "GitHub",
  repoDisplay: true,

  // 文档在仓库中的目录
  docsDir: "src",
  // 文档所在分支
  docsBranch: "master",

  // 导航栏
  navbar,
  // 全屏按钮
  fullscreen: true,

  // 侧边栏
  sidebar,

  // 页脚
  copyright: "版权所有 © 2026-至今 Nanxu",
  footer: '使用 <a href="https://theme-hope.vuejs.press/zh/" target="_blank">VuePress Theme Hope</a> 主题 | MIT 协议',
  license: "MIT",
  displayFooter: true,

  // 多语言配置
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  blog: {
    medias: {
      GitHub: "https://github.com/nanxu001",
      Gitee: "https://gitee.com/nanxu001",
      QQ: "https://qm.qq.com/cgi-bin/qm/qr?k=Iwk_VbhR9fSH9bi__95rQetAr4BjMY8M",
      Steam: "https://steamcommunity.com/id/nanxu001/"
    }
  },

  // 如果想要实时查看任何改变，启用它。注: 这对更新性能有很大负面影响
  hotReload: true,

  // 此处开启了很多功能用于演示，你应仅保留用到的功能。
  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    demo: true,
    figure: true,
    gfm: true,
    imgLazyload: true,
    imgSize: true,
    include: true,
    mark: true,
    plantuml: true,
    spoiler: true,
    mermaid: true,
    stylize: [
      {
        matcher: "Recommended",
        replacer: ({ tag }) => {
          if (tag === "em")
            return {
              tag: "Badge",
              attrs: { type: "tip" },
              content: "Recommended",
            };
        },
      },
    ],
    sub: true,
    sup: true,
    tabs: true,
    tasklist: true,
    vPre: true,
    highlighter: {
      highlightLines: false,
      notationDiff: true,
      notationHighlight: true
    }

    // 取消注释它们如果你需要 TeX 支持
    // math: {
    //   // 启用前安装 katex
    //   type: "katex",
    //   // 或者安装 mathjax-full
    //   type: "mathjax",
    // },

    // 如果你需要幻灯片，安装 @vuepress/plugin-revealjs 并取消下方注释
    // revealjs: {
    //   plugins: ["highlight", "math", "search", "notes", "zoom"],
    // },

    // 在启用之前安装 chart.js
    // chartjs: true,

    // insert component easily

    // 在启用之前安装 echarts
    // echarts: true,

    // 在启用之前安装 flowchart.ts
    // flowchart: true,

    // 在启用之前安装 mermaid
    // mermaid: true,

    // playground: {
    //   presets: ["ts", "vue"],
    // },

    // 在启用之前安装 @vue/repl
    // vuePlayground: true,

    // 在启用之前安装 sandpack-vue3
    // sandpack: true,
  },

  // 在这里配置主题提供的插件
  plugins: {
    // 注意: 仅用于测试! 你必须自行生成并在生产环境中使用自己的评论服务
    comment: false,

    components: {
      components: ["Badge", "VPCard"],
    },

    icon: {
      assets: "fontawesome-with-brands",
    },

    copyright: true,

    blog: true,

    docsearch: {
      appId: verificationConfig.docsearch.appId,
      apiKey: verificationConfig.docsearch.apiKey,
      indexName: verificationConfig.docsearch.indexName,
    },

    seo: {
      customHead: (head) => {
        // 百度
        head.push([
          'meta',
          {
            name: 'baidu-site-verification',
            content: verificationConfig.baiduSiteVerification,
          },
        ]);
        // Google
        head.push([
          'meta',
          {
            name: 'google-site-verification',
            content: verificationConfig.googleSiteVerification,
          },
        ]);
      },
    }

    // 如果你需要 PWA。安装 @vuepress/plugin-pwa 并取消下方注释
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cacheImage: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});
