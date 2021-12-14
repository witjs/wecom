import { BaseRet } from "../../../common/interface";

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
      | "taskcard"
      | "template_card";
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
    // 表示是否开启id转译，0表示否，1表示是，默认0
    enable_id_trans?: 0 | 1;
    // 表示是否开启重复消息检查，0表示否，1表示是，默认0
    enable_duplicate_check?: 0 | 1;
    // 表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时
    duplicate_check_interval?: number;
  }
  // 文本消息
  export interface Text extends Common {
    msgtype: "text";
    text: {
      // 消息内容，最长不超过2048个字节，超过将截断（支持id转译）
      content: string;
    };
  }
  // 图片消息
  export interface Image extends Omit<Common, "enable_id_trans"> {
    msgtype: "image";
    image: {
      media_id: string;
    };
  }
  // 语音消息
  export interface Voice extends Omit<Common, "enable_id_trans"> {
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
  export interface File extends Omit<Common, "enable_id_trans"> {
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
  }

  // 图文消息
  export interface Markdown extends Omit<Common, "enable_id_trans"> {
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
  }

  // 模板卡片消息
  export namespace TemplateCard {
    interface CardCommon {
      // 卡片来源样式信息，不需要来源样式可不填写
      source?: {
        // 来源图片的url
        icon_url?: string;
        // 来源图片的描述，建议不超过20个字，（支持id转译）
        desc?: string;
        // 来源文字的颜色，目前支持：0(默认) 灰色，1 黑色，2 红色，3 绿色
        desc_color?: number;
      };
      // 卡片右上角更多操作按钮
      action_menu?: {
        // 更多操作界面的描述
        desc?: string;
        // 操作列表，列表长度取值范围为 [1, 3]
        action_list: {
          // 操作的描述文案
          text: string;
          // 操作key值，用户点击后，会产生回调事件将本参数作为EventKey返回，回调事件会带上该key值，最长支持1024字节，不可重复
          key: string;
        }[];
      };
      main_title?: {
        // 一级标题，建议不超过36个字，文本通知型卡片本字段非必填，但不可本字段和sub_title_text都不填，（支持id转译）
        title?: string;
        // 标题辅助信息，建议不超过44个字，（支持id转译）
        desc?: string;
      };
    }
    export interface TemplateCardCommon<T> extends Common {
      msgtype: "template_card";
      template_card: CardCommon & T;
    }
    // 引用文献样式
    interface QuoteArea {
      // 引用文献样式区域点击事件，0或不填代表没有点击事件，1 代表跳转url，2 代表跳转小程序
      type?: number;
      // 点击跳转的url，quote_area.type是1时必填
      url?: string;
      // 点击跳转的小程序的appid，必须是与当前应用关联的小程序，quote_area.type是2时必填
      appid?: string;
      // 点击跳转的小程序的pagepath，quote_area.type是2时选填
      pagepath?: string;
      // 引用文献样式的标题
      title?: string;
      // 引用文献样式的引用文案
      quote_text?: string;
    }
    // 二级标题+文本列表，该字段可为空数组，但有数据的话需确认对应字段是否必填，列表长度不超过6
    interface HorizontalContentItem {
      // 链接类型，0或不填代表不是链接，1 代表跳转url，2 代表下载附件，3 代表点击跳转成员详情
      type?: number;
      // 二级标题，建议不超过5个字
      keyname: string;
      // 二级文本，如果horizontal_content_list.type是2，该字段代表文件名称（要包含文件类型），建议不超过30个字，（支持id转译）
      value?: string;
      // 链接跳转的url，horizontal_content_list.type是1时必填
      url?: string;
      // 附件的media_id，horizontal_content_list.type是2时必填
      media_id?: string;
      // 成员详情的userid，horizontal_content_list.type是3时必填
      userid?: string;
    }

    // 跳转指引样式的列表，该字段可为空数组，但有数据的话需确认对应字段是否必填，列表长度不超过3
    interface JumpListItem {
      // 跳转链接类型，0或不填代表不是链接，1 代表跳转url，2 代表跳转小程序
      type?: number;
      // 跳转链接样式的文案内容，建议不超过18个字
      title: string;
      // 跳转链接的url，jump_list.type是1时必填
      url?: string;
      // 跳转链接的小程序的appid，必须是与当前应用关联的小程序，jump_list.type是2时必填
      appid?: string;
      // 跳转链接的小程序的pagepath，jump_list.type是2时选填
      pagepath?: string;
    }

    interface SubmitButton {
      // 按钮文案，建议不超过10个字，不填默认为提交
      text: string;
      // 提交按钮的key，会产生回调事件将本参数作为EventKey返回，最长支持1024字节
      key: string;
    }

    // interface TemplateCardCommon

    export interface TextNotice extends CardCommon {
      card_type: "text_notice";
      // 引用文献样式
      quote_area?: QuoteArea;
      // 关键数据样式
      emphasis_content?: {
        // 关键数据样式的数据内容，建议不超过14个字
        title?: string;
        // 关键数据样式的数据描述内容，建议不超过22个字
        desc?: string;
      };
      // 二级普通文本，建议不超过160个字，（支持id转译）
      sub_title_text?: string;
      // 二级标题+文本列表，该字段可为空数组，但有数据的话需确认对应字段是否必填，列表长度不超过6
      horizontal_content_list?: HorizontalContentItem[];
      // 跳转指引样式的列表，该字段可为空数组，但有数据的话需确认对应字段是否必填，列表长度不超过3
      jump_list?: JumpListItem[];
      // 整体卡片的点击跳转事件，text_notice必填本字段
      card_action: {
        // 跳转事件类型，1 代表跳转url，2 代表打开小程序。text_notice卡片模版中该字段取值范围为[1,2]
        type: number;
        // 跳转事件的url，card_action.type是1时必填
        url?: string;
        // 跳转事件的小程序的appid，必须是与当前应用关联的小程序，card_action.type是2时必填
        appid?: string;
        // 跳转事件的小程序的pagepath，card_action.type是2时选填
        pagepath?: string;
      };
      // 任务id，同一个应用任务id不能重复，只能由数字、字母和“_-@”组成，最长128字节，填了action_menu字段的话本字段必填
      task_id?: string;
    }
    export interface NewsNotice extends CardCommon {
      card_type: "news_notice";
      // 引用文献样式
      quote_area?: QuoteArea;
      // 左图右文样式，news_notice类型的卡片，card_image和image_text_area两者必填一个字段，不可都不填
      image_text_area?: {
        // 左图右文样式区域点击事件，0或不填代表没有点击事件，1 代表跳转url，2 代表跳转小程序
        type?: number;
        // 点击跳转的url，image_text_area.type是1时必填
        url?: string;
        // 点击跳转的小程序的appid，必须是与当前应用关联的小程序，image_text_area.type是2时必填
        appid?: string;
        // 点击跳转的小程序的pagepath，image_text_area.type是2时选填
        pagepath?: string;
        // 左图右文样式的标题
        title?: string;
        // 左图右文样式的描述
        desc?: string;
        // 左图右文样式的图片url
        image_url: string;
      };
      // 图片样式，news_notice类型的卡片，card_image和image_text_area两者必填一个字段，不可都不填
      card_image: {
        // 图片的url
        url: string;
        // 图片的宽高比，宽高比要小于2.25，大于1.3，不填该参数默认1.3
        aspect_ratio?: number;
      };
      // 卡片二级垂直内容，该字段可为空数组，但有数据的话需确认对应字段是否必填，列表长度不超过4
      vertical_content_list?: {
        // 卡片二级标题，建议不超过38个字
        title: string;
        // 二级普通文本，建议不超过160个字
        desc?: string;
      }[];
      // 二级标题+文本列表，该字段可为空数组，但有数据的话需确认对应字段是否必填，列表长度不超过6
      horizontal_content_list?: HorizontalContentItem[];
      // 跳转指引样式的列表，该字段可为空数组，但有数据的话需确认对应字段是否必填，列表长度不超过3
      jump_list?: JumpListItem[];
      // 整体卡片的点击跳转事件，news_notice必填本字段
      card_action: {
        // 跳转事件类型，1 代表跳转url，2 代表打开小程序。news_notice卡片模版中该字段取值范围为[1,2]
        type: number;
        // 跳转事件的url，card_action.type是1时必填
        url?: string;
        // 跳转事件的小程序的appid，必须是与当前应用关联的小程序，card_action.type是2时必填
        appid?: string;
        // 跳转事件的小程序的pagepath，card_action.type是2时选填
        pagepath?: string;
      };
      // 任务id，同一个应用任务id不能重复，只能由数字、字母和“_-@”组成，最长128字节，填了action_menu字段的话本字段必填
      task_id?: string;
    }
    export interface ButtonInteraction extends CardCommon {
      card_type: "button_interaction";
      // 引用文献样式
      quote_area?: QuoteArea;
      sub_title_text?: string;
      horizontal_content_list?: HorizontalContentItem[];
      card_action?: {
        // 跳转事件类型，0或不填代表不是链接，1 代表跳转url，2 代表打开小程序
        type?: number;
        // 跳转事件的url，card_action.type是1时必填
        url?: string;
        // 跳转事件的小程序的appid，必须是与当前应用关联的小程序，card_action.type是2时必填
        appid?: string;
        // 跳转事件的小程序的pagepath，card_action.type是2时选填
        pagepath?: string;
      };
      task_id: string;
      button_selection: {
        // 下拉式的选择器的key，用户提交选项后，会产生回调事件，回调事件会带上该key值表示该题，最长支持1024字节
        question_key: string;
        // 下拉式的选择器左边的标题
        title?: string;
        // 选项列表，下拉选项不超过 10 个，最少1个
        option_list: {
          // 下拉式的选择器选项的id，用户提交后，会产生回调事件，回调事件会带上该id值表示该选项，最长支持128字节，不可重复
          id: string;
          // 下拉式的选择器选项的文案，建议不超过16个字
          text: string;
        };
        // 默认选定的id，不填或错填默认第一个
        selected_id: string;
      };
      button_list: {
        // 按钮点击事件类型，0 或不填代表回调点击事件，1 代表跳转url
        type?: number;
        // 按钮文案，建议不超过10个字
        text: string;
        // 按钮样式，目前可填1~4，不填或错填默认1
        style?: string;
        // 按钮key值，用户点击后，会产生回调事件将本参数作为EventKey返回，回调事件会带上该key值，最长支持1024字节，不可重复，button_list.type是0时必填
        key?: string;
        // 跳转事件的url，button_list.type是1时必填
        url?: string;
      }[];
    }
    export interface VoteInteraction extends CardCommon {
      card_type: "vote_interaction";
      // 任务id，同一个应用任务id不能重复，只能由数字、字母和“_-@”组成，最长128字节
      task_id: string;
      // 选择题样式
      checkbox?: {
        // 选择题key值，用户提交选项后，会产生回调事件，回调事件会带上该key值表示该题，最长支持1024字节
        question_key: string;
        // 选择题模式，单选：0，多选：1，不填默认0
        mode: number;
        option_list: {
          // 选项id，用户提交选项后，会产生回调事件，回调事件会带上该id值表示该选项，最长支持128字节，不可重复
          id: number;
          // 选项文案描述，建议不超过17个字
          text: string;
          // 该选项是否要默认选中
          is_checked: boolean;
        }[];
      };
      // 提交按钮样式
      submit_button?: {
        // 按钮文案，建议不超过10个字，不填默认为提交
        text: string;
        // 提交按钮的key，会产生回调事件将本参数作为EventKey返回，最长支持1024字节
        key: string;
      };
    }
    export interface MultipleInteraction extends CardCommon {
      card_type: "multiple_interaction";
      // 任务id，同一个应用任务id不能重复，只能由数字、字母和“_-@”组成，最长128字节
      task_id: string;
      // 下拉式的选择器列表，multiple_interaction类型的卡片该字段不可为空，一个消息最多支持 3 个选择器
      select_list: {
        // 下拉式的选择器题目的key，用户提交选项后，会产生回调事件，回调事件会带上该key值表示该题，最长支持1024字节，不可重复
        question_key: string;
        // 下拉式的选择器上面的title
        title?: number;
        // 选项列表，下拉选项不超过 10 个，最少1个
        option_list: {
          // 选项id，用户提交选项后，会产生回调事件，回调事件会带上该id值表示该选项，最长支持128字节，不可重复
          id: number;
          // 选项文案描述，建议不超过17个字
          text: string;
        }[];
        selected_id?: string;
      }[];

      submit_button: SubmitButton;
    }
  }
}

export interface IMessageRet extends BaseRet {
  invaliduser?: string;
  invalidparty?: string;
  invalidtag?: string;
}
