import { BaseRet } from "../../common/interface";

export namespace IMessage {
  interface Common {
    msgtype:
      | "text"
      | "image"
      | "voice"
      | "file"
      | "textcard"
      | "news"
      | "mpnews"
      | "markdown"
      | "miniprogram_notice"
      | "taskcard";
    // 应用ID
    agentid?: number;
    //指定接收消息的成员，成员ID列表（多个接收者用‘|’分隔，最多支持1000个）。
    //特殊情况：指定为”@all”，则向该企业应用的全部成员发送
    touser?: string;
    // 指定接收消息的部门，部门ID列表，多个接收者用‘|’分隔，最多支持100个。
    // 当touser为”@all”时忽略本参数
    topart?: string;
    // 指定接收消息的标签，标签ID列表，多个接收者用‘|’分隔，最多支持100个。
    // 当touser为”@all”时忽略本参数
    totag?: string;
    // 表示是否是保密消息，0表示否，1表示是，默认0
    safe?: 0 | 1;
    // 表示是否开启重复消息检查，0表示否，1表示是，默认0
    enable_duplicate_check?: 0 | 1;
    // 表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时
    duplicate_check_interval?: 0 | 1;
  }
  // 文本消息
  export interface Text extends Common {
    msgtype: "text";
    text: {
      // 消息内容，最长不超过2048个字节，超过将截断（支持id转译）
      content: string;
    };
    // 表示是否开启id转译，0表示否，1表示是，默认0
    enable_id_trans?: 0 | 1;
  }
  // 图片消息
  export interface Image extends Common {
    msgtype: "image";
    image: {
      media_id: string;
    };
  }
  // 语音消息
  export interface Voice extends Common {
    msgtype: "voice";
    voice: {
      // 视频媒体文件id，可以调用上传临时素材接口获取
      media_id: string;
      // 视频消息的标题，不超过128个字节，超过会自动截断
      title?: string;
      // 视频消息的描述，不超过512个字节，超过会自动截断
      description?: string;
    };
  }
  // 文件
  export interface File extends Common {
    msgtype: "file";
    voice: {
      // 视频媒体文件id，可以调用上传临时素材接口获取
      media_id: string;
    };
  }
  // 文本卡片消息
  export interface TextCard extends Common {
    msgtype: "textcard";
    textcard: {
      title: string;
      description: string;
      url: string;
      btntxt?: string;
    };
    enable_id_trans?: 0 | 1;
  }

  interface NewsArticleItem {
    // 标题，不超过128个字节，超过会自动截断（支持id转译）
    title: string;
    // 点击后跳转的链接。
    url: string;
    // 描述，不超过512个字节，超过会自动截断（支持id转译）
    description?: string;
    // 图文消息的图片链接，支持JPG、PNG格式，较好的效果为大图 1068*455，小图150*150。
    picurl?: string;
  }
  // 图文消息
  export interface News extends Common {
    msgtype: "news";
    news: {
      // 图文消息，一个图文消息支持1到8条图文
      articles: NewsArticleItem[];
    };
    enable_id_trans?: 0 | 1;
  }

  interface MPNewsArticleItem {
    // 	标题，不超过128个字节，超过会自动截断（支持id转译）
    title: string;
    // 图文消息缩略图的media_id, 可以通过素材管理接口获得。此处thumb_media_id即上传接口返回的media_id
    thumb_media_id: string;
    // 图文消息的内容，支持html标签，不超过666 K个字节（支持id转译）
    content: string;
    // 图文消息的作者，不超过64个字节
    author?: string;
    // 图文消息点击“阅读原文”之后的页面链接
    content_source_url?: string;
    // 图文消息的描述，不超过512个字节，超过会自动截断（支持id转译）
    digest?: string;
  }
  // 图文消息
  export interface MPNews extends Common {
    msgtype: "mpnews";
    mpnews: {
      // 图文消息，一个图文消息支持1到8条图文
      articles: MPNewsArticleItem[];
    };
    enable_id_trans?: 0 | 1;
  }

  // 图文消息
  export interface Markdown extends Common {
    msgtype: "markdown";
    markdown: {
      // markdown内容，最长不超过2048个字节，必须是utf8编码
      content: string;
    };
  }
  // 小程序通知消息
  export interface MiniProgramNotice extends Common {
    msgtype: "miniprogram_notice";
    miniprogram_notice: {
      // 小程序appid，必须是与当前小程序应用关联的小程序
      appid: string;
      // 消息标题，长度限制4-12个汉字（支持id转译）
      title: "会议室预订成功通知";
      // 点击消息卡片后的小程序页面，仅限本小程序内的页面。该字段不填则消息点击后不跳转。
      page?: string;
      // 消息描述，长度限制4-12个汉字（支持id转译）
      description?: string;
      // 是否放大第一个content_item
      emphasis_first_item?: boolean;
      // 消息内容键值对，最多允许10个item
      content_item?: { key: string; value: string }[];
    };
    enable_id_trans?: 0 | 1;
  }
  // 任务卡片消息 仅企业微信2.8.2及以上版本支持
  export interface TaskCard extends Common {
    msgtype: "taskcard";
    taskcard: {
      // 标题，不超过128个字节，超过会自动截断（支持id转译）
      title: string;
      // 描述，不超过512个字节，超过会自动截断（支持id转译）
      description: string;
      // 任务id，同一个应用发送的任务卡片消息的任务id不能重复，只能由数字、字母和“_-@”组成，最长支持128字节
      task_id: string;
      // 点击后跳转的链接。最长2048字节，请确保包含了协议头(http/https)
      url: string;
      btn: {
        // 按钮key值，用户点击后，会产生任务卡片回调事件，回调事件会带上该key值，只能由数字、字母和“_-@”组成，最长支持128字节
        key: string;
        // 按钮名称
        name: string;
        // 点击按钮后显示的名称，默认为“已处理”
        replace_name?: string;
        // 按钮字体颜色，可选“red”或者“blue”,默认为“blue”
        color?: "red" | "blue";
        // 按钮字体是否加粗，默认false
        is_bold?: boolean;
      }[];
    };
    enable_id_trans?: 0 | 1;
  }
}

export interface IMessageRet extends BaseRet {
  invaliduser?: string;
  invalidparty?: string;
  invalidtag?: string;
}
