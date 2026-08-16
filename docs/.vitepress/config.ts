import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'zh-CN',
  title: 'wecom',
  description: '面向 Node.js 22.18+ 的企业微信 TypeScript SDK',
  base: '/wecom/',
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/wecom/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#1a73e8' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'wecom',
    nav: [
      { text: '指南', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: '模块', link: '/api/', activeMatch: '/api/' },
      {
        text: '1.0.0-rc.2',
        items: [{ text: '更新日志', link: '/guide/changelog' }],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '配置', link: '/guide/config' },
            { text: 'Token 与重试', link: '/guide/token' },
            { text: '错误处理', link: '/guide/errors' },
            { text: '从 0.8 迁移', link: '/guide/migration' },
            { text: '更新日志', link: '/guide/changelog' },
          ],
        },
      ],
      '/api/': [
        {
          text: '模块',
          items: [{ text: '总览', link: '/api/' }],
        },
        {
          text: '核心',
          items: [{ text: 'Wecom', link: '/api/wecom' }],
        },
        {
          text: '通讯录',
          collapsed: false,
          items: [
            { text: 'User 成员', link: '/api/user' },
            { text: 'Department 部门', link: '/api/department' },
            { text: 'Tag 标签', link: '/api/tag' },
            { text: 'Batch 异步导入', link: '/api/batch' },
          ],
        },
        {
          text: '应用与消息',
          collapsed: false,
          items: [
            { text: 'Agent 应用', link: '/api/agent' },
            { text: 'AgentMenu 菜单', link: '/api/agent-menu' },
            { text: 'Media 素材', link: '/api/media' },
            { text: 'Message 消息', link: '/api/message' },
            { text: 'AppChat 群聊', link: '/api/appchat' },
          ],
        },
        {
          text: '客户联系',
          items: [
            { text: 'ExternalContact 客户联系', link: '/api/external-contact' },
          ],
        },
        {
          text: '协作工具',
          collapsed: false,
          items: [
            { text: 'Calendar 日历', link: '/api/calendar' },
            { text: 'Schedule 日程', link: '/api/schedule' },
            { text: 'MeetingRoom 会议室', link: '/api/meeting-room' },
          ],
        },
        {
          text: 'OA',
          collapsed: false,
          items: [
            { text: 'Checkin 打卡', link: '/api/checkin' },
            { text: 'Approval 审批', link: '/api/approval' },
            { text: 'Dial 公费电话', link: '/api/dial' },
          ],
        },
        {
          text: '财务',
          items: [{ text: 'Invoice 发票', link: '/api/invoice' }],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/witjs/wecom' }],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },
    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdated: { text: '最后更新' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    footer: {
      message: '基于 MIT 协议发布',
      copyright: 'Copyright © 2021-present wecom',
    },
    editLink: {
      pattern: 'https://github.com/witjs/wecom/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
  },
});
