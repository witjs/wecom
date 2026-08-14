# ExternalContact

客户联系：客户、联系我、企业标签、客户群、欢迎语和在职/离职分配。需要客户联系权限的 Secret。

```ts
import { ExternalContact } from 'wecom';

const contact = new ExternalContact({
  corpId: process.env.CORPID!,
  corpSecret: process.env.TEST_SECRET!,
});
```

## 客户

| 方法                           | 说明                 |
| ------------------------------ | -------------------- |
| `getFollowUserList()`          | 配置了客户联系的成员 |
| `list(userid)`                 | 成员的客户列表       |
| `get(externalUserid, cursor?)` | 客户详情             |
| `batchGetByUser(data)`         | 批量客户详情         |
| `remark(data)`                 | 修改客户备注         |

## 联系我

| 方法                      | 说明           |
| ------------------------- | -------------- |
| `addContactWay(data)`     | 配置「联系我」 |
| `getContactWay(configId)` | 查询配置       |
| `updateContactWay(data)`  | 更新配置       |
| `delContactWay(configId)` | 删除配置       |
| `listContactWay(data?)`   | 配置列表       |

## 企业标签

| 方法                               | 说明         |
| ---------------------------------- | ------------ |
| `getCorpTagList(tagId?, groupId?)` | 标签列表     |
| `addCorpTag(data)`                 | 添加标签     |
| `editCorpTag(data)`                | 编辑标签     |
| `delCorpTag(data)`                 | 删除标签     |
| `markTag(data)`                    | 给客户打标签 |

## 客户群与群发

| 方法                   | 说明             |
| ---------------------- | ---------------- |
| `groupChatList(data)`  | 客户群列表       |
| `groupChatGet(data)`   | 客户群详情       |
| `sendWelcomeMsg(data)` | 发送新客户欢迎语 |
| `addMsgTemplate(data)` | 创建企业群发     |

## 分配与统计

| 方法                             | 说明           |
| -------------------------------- | -------------- |
| `transferCustomer(data)`         | 在职继承       |
| `resignedTransferCustomer(data)` | 离职继承       |
| `getUnassignedList(data?)`       | 离职未分配客户 |
| `getUserBehaviorData(data)`      | 联系客户统计   |

```ts
const { follow_user } = await contact.getFollowUserList();
const { external_userid } = await contact.list(follow_user[0]);
const detail = await contact.get(external_userid[0]);

const { config_id } = await contact.addContactWay({
  type: 1,
  scene: 2,
  user: [follow_user[0]],
});
```
