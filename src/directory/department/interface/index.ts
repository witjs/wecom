export interface ICreateDepartment {
  // 部门名称。同一个层级的部门名称不能重复。长度限制为1~32个字符，字符不能包括\:?”<>｜
  name: string;
  // 父部门id，32位整型
  parentid: number;
  // 英文名称。同一个层级的部门名称不能重复。需要在管理后台开启多语言支持才能生效。长度限制为1~32个字符，字符不能包括\:?”<>｜
  name_en?: string;
  // 在父部门中的次序值。order值大的排序靠前。有效的值范围是[0, 2^32)
  order?: number;
  // 部门id，32位整型，指定时必须大于1。若不填该参数，将自动生成id
  id?: number;
}

export interface IUpdateDepartment {
  // 部门id
  id: number;
  // 部门名称。长度限制为1~32个字符，字符不能包括\:?”<>｜
  name?: string;
  // 父部门id，32位整型
  parentid?: number;
  // 英文名称。同一个层级的部门名称不能重复。需要在管理后台开启多语言支持才能生效。长度限制为1~32个字符，字符不能包括\:?”<>｜
  name_en?: string;
  // 在父部门中的次序值。order值大的排序靠前。有效的值范围是[0, 2^32)
  order?: number;
}
