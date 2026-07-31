export const area = [
  {
    label: "浙江省",
    value: "330000",
    children: [
      {
        label: "杭州市",
        value: "330100",
        children: [
          {
            label: "上城区",
            value: "330102",
          },
          {
            label: "下城区",
            value: "330103",
          },
          {
            label: "江干区",
            value: "330104",
          },
        ],
      },
      {
        label: "宁波市",
        value: "330200",
        children: [
          {
            label: "海曙区",
            value: "330203",
          },
          {
            label: "江北区",
            value: "330205",
          },
          {
            label: "北仑区",
            value: "330206",
          },
        ],
      },
      {
        label: "温州市",
        value: "330300",
        children: [
          {
            label: "鹿城区",
            value: "330302",
          },
          {
            label: "龙湾区",
            value: "330303",
          },
          {
            label: "瓯海区",
            value: "330304",
          },
        ],
      },
    ],
  },
  {
    label: "江苏省",
    value: "320000",
    children: [
      {
        label: "南京市",
        value: "320100",
        children: [
          {
            label: "玄武区",
            value: "320102",
          },
          {
            label: "秦淮区",
            value: "320104",
          },
          {
            label: "建邺区",
            value: "320105",
          },
        ],
      },
      {
        label: "无锡市",
        value: "320200",
        children: [
          {
            label: "锡山区",
            value: "320205",
          },
          {
            label: "惠山区",
            value: "320206",
          },
          {
            label: "滨湖区",
            value: "320211",
          },
        ],
      },
      {
        label: "徐州市",
        value: "320300",
        children: [
          {
            label: "鼓楼区",
            value: "320302",
          },
          {
            label: "云龙区",
            value: "320303",
          },
          {
            label: "贾汪区",
            value: "320305",
          },
        ],
      },
    ],
  },
]

export const dept = [
  {
    label: "研发中心",
    value: "1",
    children: [
      {
        label: "产线1",
        value: "1-1",
        children: [
          {
            label: "研发",
            value: "1-1-1",
          },
          {
            label: "测试",
            value: "1-1-2",
          },
          {
            label: "产品",
            value: "1-1-3",
          },
          {
            label: "产品2",
            value: "1-1-4",
          },
          {
            label: "产品3",
            value: "1-1-5",
          },
          {
            label: "产品4",
            value: "1-1-6",
          },
          {
            label: "产品5",
            value: "1-1-7",
          },
          {
            label: "产品6",
            value: "1-1-8",
          },
          {
            label: "产品7",
            value: "1-1-9",
          },
          {
            label: "产品8",
            value: "1-1-10",
          },
          {
            label: "产品9",
            value: "1-1-11",
          },

          {
            label: "产品10",
            value: "1-1-12",
          },
          {
            label: "产品11",
            value: "1-1-13",
          },
        ],
      },
      {
        label: "产线2",
        value: "1-2",
      },
    ],
  },
  {
    label: "客户中心",
    value: "2",
    children: [
      {
        label: "客服",
        value: "2-1",
      },
      {
        label: "销售",
        value: "2-2",
      },
    ],
  },
]

export const customArea = [
  {
    name: "浙江省",
    code: "330000",
    data: [
      {
        name: "杭州市",
        code: "330100",
        data: [
          {
            name: "上城区",
            code: "330102",
          },
          {
            name: "下城区",
            code: "330103",
          },
          {
            name: "江干区",
            code: "330104",
          },
        ],
      },
      {
        name: "宁波市",
        code: "330200",
        data: [
          {
            name: "海曙区",
            code: "330203",
          },
          {
            name: "江北区",
            code: "330205",
          },
          {
            name: "北仑区",
            code: "330206",
          },
        ],
      },
      {
        name: "温州市",
        code: "330300",
        data: [
          {
            name: "鹿城区",
            code: "330302",
          },
          {
            name: "龙湾区",
            code: "330303",
          },
          {
            name: "瓯海区",
            code: "330304",
          },
        ],
      },
    ],
  },
  {
    name: "江苏省",
    code: "320000",
    data: [
      {
        name: "南京市",
        code: "320100",
        data: [
          {
            name: "玄武区",
            code: "320102",
          },
          {
            name: "秦淮区",
            code: "320104",
          },
          {
            name: "建邺区",
            code: "320105",
          },
        ],
      },
      {
        name: "无锡市",
        code: "320200",
        data: [
          {
            name: "锡山区",
            code: "320205",
          },
          {
            name: "惠山区",
            code: "320206",
          },
          {
            name: "滨湖区",
            code: "320211",
          },
        ],
      },
      {
        name: "徐州市",
        code: "320300",
        data: [
          {
            name: "鼓楼区",
            code: "320302",
          },
          {
            name: "云龙区",
            code: "320303",
          },
          {
            name: "贾汪区",
            code: "320305",
          },
        ],
      },
    ],
  },
]

export const customRenderOptions = [
  {
    label: "研发中心",
    value: "research",
    brief: "核心产品与技术团队",
    badge: "推荐",
    children: [
      {
        label: "平台研发",
        value: "platform",
        brief: "基础架构与研发效能",
      },
      {
        label: "业务研发",
        value: "business",
        brief: "面向业务场景交付产品",
      },
    ],
  },
  {
    label: "客户中心",
    value: "customer",
    brief: "服务客户与一线团队",
    children: [
      {
        label: "客户成功",
        value: "success",
        brief: "客户接入与持续运营",
      },
      {
        label: "技术支持",
        value: "support",
        brief: "问题定位与解决方案",
      },
    ],
  },
  {
    label: "战略中心",
    value: "strategy",
    brief: "暂未开放选择",
    disabled: true,
  },
]

export const dynamic = [
  {
    label: "产品",
    value: "1",
  },
  {
    label: "测试",
    value: "2",
  },
  {
    label: "研发",
    value: "3",
  },
]
