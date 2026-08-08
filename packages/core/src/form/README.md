# Form 表单

### 介绍

用于数据录入、校验，支持输入框、单选框、复选框、文件上传等类型。

### 引入

```tsx
import { Form } from "@taroify/core"
```

## 代码演示

### 基础用法

在表单中，每个 `Form.Item` 代表一个表单项

```tsx
function BasicForm() {
  const onSubmit = (event: BaseEventOrig<FormProps.onSubmitEventDetail>) => {
    Toast.open(JSON.stringify(event.detail.value))
  }

  return (
    <Form onSubmit={onSubmit}>
      <Toast id="toast" />
      <Cell.Group inset>
        <Form.Item name="username" rules={[{ required: true, message: "请填写用户名" }]}>
          <Form.Label>用户名</Form.Label>
          <Form.Control>
            <Input placeholder="用户名" />
          </Form.Control>
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: "请填写密码" }]}>
          <Form.Label>密码</Form.Label>
          <Form.Control>
            <Input password placeholder="密码" />
          </Form.Control>
        </Form.Item>
        <Field
          name="text"
          label={{ align: "left", children: "文本" }}
          rules={[{ required: true, message: "请填写文本" }]}
        >
          <Input placeholder="请输入文本" />
        </Field>
      </Cell.Group>
      <View style={{ margin: "16px" }}>
        <Button shape="round" block color="primary" formType="submit">
          提交
        </Button>
      </View>
    </Form>
  )
}
```

使用`Field`组件

```tsx
function BasicForm() {
  const onSubmit = (event: BaseEventOrig<FormProps.onSubmitEventDetail>) => {
    Toast.open(JSON.stringify(event.detail.value))
  }

  return (
    <Form onSubmit={onSubmit}>
      <Toast id="toast" />
      <Cell.Group inset>
        <Field label="用户名" name="username" rules={[{ required: true, message: "请填写用户名" }]}>
          <Input placeholder="用户名" />
        </Field>
        <Field label="密码" name="password" rules={[{ required: true, message: "请填写密码" }]}>
          <Input password placeholder="密码" />
        </Field>
      </Cell.Group>
      <View style={{ margin: "16px" }}>
        <Button shape="round" block color="primary" formType="submit">
          提交
        </Button>
      </View>
    </Form>
  )
}
```

### 自动显示必填星号 <Tag tag="v1.0.5" />

设置 `required="auto"` 后，Form.Item 和 Field 会根据 `rules` 中的 `required` 规则自动显示必填星号。`required` 只控制星号显示，实际校验仍由 `rules.required` 完成。

```tsx
function FormWithRequiredMark() {
  return (
    <Form required="auto">
      <Cell.Group inset>
        <Field label="用户名" name="username" rules={[{ required: true }]}>
          <Input placeholder="自动显示必填星号" />
        </Field>
        <Field label="昵称" name="nickname" rules={[{ required: false }]}>
          <Input placeholder="非必填项不显示星号" />
        </Field>
      </Cell.Group>
    </Form>
  )
}
```

单个 Form.Item 或 Field 可以通过显式设置 `required` 覆盖 Form 的配置。

### 校验规则

通过 `rules` 定义表单校验规则，所有可用字段见[下方表格](#rule-%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84)。

```tsx
function FormWithRules() {
  const asyncValidator = (val: any) =>
    new Promise<boolean>((resolve) => {
      Toast.loading("验证中...")

      setTimeout(() => {
        Toast.close("toast")
        resolve(/\d{6}/.test(val))
      }, 1000)
    })

  function onValidate(errors: FormValidError[]) {
    Toast.open({
      style: {
        textAlign: "left",
      },
      message: JSON.stringify(errors, undefined, 2),
    })
  }

  return (
    <Form defaultValues={{ validatorMessage: "abc" }} onValidate={onValidate}>
      <Toast id="toast" />
      <Cell.Group inset>
        <Field
          label="文本"
          name="pattern"
          rules={[{ pattern: /\d{6}/, message: "请输入正确内容" }]}
        >
          <Input placeholder="正则校验" />
        <Field
          label="文本"
          name="validator"
          rules={[{ validator: (val) => /1\d{10}/.test(val), message: "请输入正确内容" }]}
        >
          <Input placeholder="函数校验" />
        </Field>
        <Field
          label="文本"
          name="validatorMessage"
          rules={[{ validator: (val) => `${val ?? ""} 不合法，请重新输入` }]}
        >
          <Input placeholder="校验函数返回错误提示" />
        </Field>
        <Field
          label="文本"
          name="asyncValidator"
          rules={[{ validator: asyncValidator, message: "请输入正确内容" }]}
        >
          <Input placeholder="异步函数校验" />
        </Field>
      </Cell.Group>
      <View style={{ margin: "16px" }}>
        <Button shape="round" block color="primary" formType="submit">
          提交
        </Button>
      </View>
    </Form>
  )
}
```

### 禁用表单

设置 `disabled` 后，会为 `Form` 内部的 `taroify` 组件 `Input`, `Textarea`, `Checkbox`, `Switch`, `Checkbox.Group`, `Radio.Group`, `Rate`, `Slider`, `Stepper`, `Uploader` 设置 `disabled` <br />

form 设置 disabled 后，也可以单独为表单项和组件设置 disabled={false}, 优先级：表单 < 表单项 < 组件

### 表单项类型 - 开关

在表单中使用 [Switch 组件](/components/switch)。

```tsx
<Field label="开关" name="switch">
  <Switch size={20} />
</Field>
```

### 表单项类型 - 复选框

在表单中使用 [Checkbox 组件](/components/checkbox)。

```tsx
<Field label="复选框" name="checkbox">
  <Checkbox shape="square" />
</Field>
<Field label="复选框组" name="checkboxGroup">
  <Checkbox.Group direction="horizontal">
    <Checkbox name="1" shape="square">
      复选框 1
    </Checkbox>
    <Checkbox name="2" shape="square">
      复选框 2
    </Checkbox>
  </Checkbox.Group>
</Field>
```

### 表单项类型 - 单选框

在表单中使用 [Radio 组件](/components/radio)。

```tsx
<Field label="单选框" name="radio">
  <Radio.Group direction="horizontal">
    <Radio name="1">单选框 1</Radio>
    <Radio name="2">单选框 2</Radio>
  </Radio.Group>
</Field>
```

### 表单项类型 - 步进器

在表单中使用 [Stepper 组件](/components/stepper)。

```tsx
<Field label="步进器" name="stepper">
  <Stepper />
</Field>
```

### 表单项类型 - 评分

在表单中使用 [Rate 组件](/components/rate)。

```tsx
<Field label="评分" name="rate">
  <Rate />
</Field>
```

### 表单项类型 - 滑块

在表单中使用 [Slider 组件](/components/slider)。

```tsx
<Field label="滑块" name="slider">
  <Slider />
</Field>
```

### 表单项类型 - 文件上传

在表单中使用 [Uploader 组件](/components/uploader)。

```tsx
function UploaderField() {
  const itemRef = useRef<FormItemInstance>()

  function onUpload() {
    chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
    }).then(({ tempFiles }) => {
      itemRef.current?.setValue([
        ...(itemRef.current?.getValue() ? [...itemRef.current?.getValue()] : []),
        {
          url: tempFiles[0].path,
          type: tempFiles[0].type,
          name: tempFiles[0].originalFileObj?.name,
        },
      ])
    })
  }

  return (
    <Field label="文件上传" ref={itemRef} name="uploader">
      <Uploader multiple maxFiles={2} onUpload={onUpload} />
    </Field>
  )
}
```

### 表单项类型 - 选择器

在表单中使用 [Picker 组件](/components/picker)。

```tsx
function PickerField() {
  const itemRef = useRef<FormItemInstance>()
  const [open, setOpen] = useState(false)
  const columns = useMemo(
    () => [
      { label: "杭州", value: "Hangzhou" },
      { label: "宁波", value: "Ningbo" },
      { label: "温州", value: "Wenzhou" },
      { label: "绍兴", value: "Shaoxing" },
      { label: "湖州", value: "Huzhou" },
    ],
    [],
  )

  return (
    <>
      <Field label="选择器" ref={itemRef} name="picker" clickable isLink>
        <Input readonly placeholder="点击选择城市" onClick={() => setOpen(true)} />
      </Field>
      <Popup open={open} rounded placement="bottom" onClose={setOpen}>
        <Picker
          title="选择城市"
          columns={columns}
          onCancel={() => setOpen(false)}
          onConfirm={(newValue) => {
            itemRef.current?.setValue(newValue)
            setOpen(false)
          }}
        ></Picker>
      </Popup>
    </>
  )
}
```

### 表单项类型 - 时间选择器

在表单中使用 [DatetimePicker 组件](/components/datetime-picker)。

```tsx
function DatetimePickerField() {
  const itemRef = useRef<FormItemInstance>()
  const [open, setOpen] = useState(false)

  const formatDate = (date: any) => {
    if (date) {
      const hours = _.padStart(_.toString(date?.getHours()), 2, "0")
      const minutes = _.padStart(_.toString(date?.getMinutes()), 2, "0")
      return `${hours}:${minutes}`
    }
  }

  return (
    <>
      <Field label="时间选择" ref={itemRef} name="datetimePicker" clickable isLink>
        {(controller) => (
          <Input
            value={formatDate(controller.value)}
            disabled={controller.disabled}
            readonly
            placeholder="点击选择时间"
            onClick={() => setOpen(true)}
          />
        )}
      </Field>
      <Popup open={open} rounded placement="bottom" onClose={setOpen}>
        <DatetimePicker
          type="hour-minute"
          onCancel={() => setOpen(false)}
          onConfirm={(newValue) => {
            itemRef.current?.setValue(newValue)
            setOpen(false)
          }}
        ></DatetimePicker>
      </Popup>
    </>
  )
}
```

### 表单项类型 - 日历

在表单中使用 [Calendar 组件](/components/calendar)。

```tsx
function CalendarField() {
  const itemRef = useRef<FormItemInstance>()
  const [open, setOpen] = useState(false)

  const formatDate = (date: any) => {
    if (date) {
      const months = _.padStart(_.toString(date?.getMonth() + 1), 2, "0")
      const days = _.padStart(_.toString(date?.getDate()), 2, "0")
      return `${months}-${days}`
    }
  }

  return (
    <>
      <Field label="日历" ref={itemRef} name="calendar" clickable isLink>
        {(controller) => (
          <Input
            value={formatDate(controller.value)}
            disabled={controller.disabled}
            readonly
            placeholder="点击选择日期"
            onClick={() => setOpen(true)}
          />
        )}
      </Field>
      <Calendar
        type="single"
        poppable
        showPopup={open}
        onCancel={() => setOpen(false)}
        onConfirm={(newValue) => {
          itemRef.current?.setValue(newValue)
          setOpen(false)
        }}
      ></Calendar>
    </>
  )
}
```

### 动态增减表单项

通过 Form.List 动态增减表单项 `v0.1.1-alpha.3`

```tsx
function DynamicForm() {
  const ref = useRef<FormInstance>(null)
  const onManual = () => {
    ref.current?.setValues({
      contacts: [
        { name: "小红", phone: "10000" },
        { name: "小绿", phone: "10086" },
      ],
    })
  }
  return (
    <Form
      ref={ref}
      onSubmit={(e) => {
        Toast.open(JSON.stringify(e.detail.value, undefined, 2))
      }}
    >
      <Form.List name="contacts" defaultValue={[{ name: "小明", phone: "10086" }]}>
        {(fields, { add, remove }) => (
          <Cell.Group inset>
            {fields.map((field, idx) => (
              <Fragment key={field.key}>
                <Field label="姓名" name={`${field.name}.name`} key={`${field.key}.name`}>
                  {({ value, onChange }) => (
                    <>
                      <Input
                        placeholder="请输入姓名"
                        value={value}
                        onChange={(e) => {
                          onChange?.(e.detail.value)
                        }}
                      />
                      <View
                        style={{ flexShrink: 0 }}
                        onClick={() => {
                          remove(idx)
                        }}
                      >
                        删除
                      </View>
                    </>
                  )}
                </Field>
                <Field
                  label="电话"
                  name={`${field.name}.phone`}
                  key={`${field.key}.phone`}
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Input placeholder="请输入电话" />
                </Field>
              </Fragment>
            ))}
            <Button variant="text" color="primary" onClick={() => add({})}>
              添加联系人
            </Button>
          </Cell.Group>
        )}
      </Form.List>
      <View style={{ margin: "16px" }}>
        <Button shape="round" block color="primary" formType="submit">
          提交
        </Button>
        <Button style={{ marginTop: "16px" }} shape="round" block color="info" onClick={onManual}>
          手动
        </Button>
        <Button style={{ marginTop: "16px" }} shape="round" block color="warning" formType="reset">
          重置
        </Button>
      </View>
    </Form>
  )
}
```

### 依赖与自动更新

通过 dependencies 自动触发校验

```tsx
function DependenciesDemo() {
  const formRef = useRef<FormInstance>()
  const onSubmit = (event: BaseEventOrig<FormProps.onSubmitEventDetail>) => {
    Toast.open(JSON.stringify(event.detail.value))
  }

  return (
    <Form ref={formRef} onSubmit={onSubmit} validateTrigger="onChange">
      <Toast id="toast" />
      <Cell.Group inset>
        <Form.Item name="username" rules={[{ required: true, message: "请输入用户名" }]}>
          <Form.Label>用户名</Form.Label>
          <Form.Control>
            <Input placeholder="用户名" />
          </Form.Control>
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
          <Form.Label>密码</Form.Label>
          <Form.Control>
            <Input placeholder="密码" />
          </Form.Control>
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "请再次输入密码" },
            {
              validator: (val) => {
                return formRef.current?.getValues<any>()?.password === val ? true : "密码不一致"
              },
            },
          ]}
        >
          <Form.Label>确认密码</Form.Label>
          <Form.Control>
            <Input placeholder="确认密码" />
          </Form.Control>
        </Form.Item>
      </Cell.Group>
      <View style={{ margin: "16px" }}>
        <Button shape="round" block color="primary" formType="submit">
          提交
        </Button>
      </View>
    </Form>
  )
}
```

通过 shouldUpdate 和 noStyle 触发重新渲染, Form.Item 里包裹的子组件必须由函数返回，否则 shouldUpdate 不会起作用, Field 暂不支持

```tsx
function ShouldUpdateDemo() {
  const formRef = useRef<FormInstance>()
  return (
    <Form
      ref={formRef}
      onSubmit={(e) => {
        Toast.open(JSON.stringify(e.detail.value, undefined, 2))
      }}
    >
      <Toast id="toast" />
      <Cell.Group inset>
        <Form.Item name="type">
          <Form.Label>复选框</Form.Label>
          <Form.Control>
            <Checkbox shape="square" />
          </Form.Control>
        </Form.Item>
        <Form.Item name="radio">
          <Form.Label>单选框</Form.Label>
          <Form.Control>
            <Radio.Group direction="horizontal">
              <Radio name="1">单选框 1</Radio>
              <Radio name="2">单选框 2</Radio>
            </Radio.Group>
          </Form.Control>
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prev, cur) => prev.type !== cur.type}>
          {() => {
            const type = formRef.current?.getValues<any>()?.type
            if (type) {
              return (
                <Form.Item name="a1">
                  <Form.Label>复选框选中</Form.Label>
                  <Form.Control>
                    <Input />
                  </Form.Control>
                </Form.Item>
              )
            } else {
              return (
                <>
                  <Form.Item name="a2">
                    <Form.Label>复选框未选中</Form.Label>
                    <Form.Control>
                      <Input />
                    </Form.Control>
                  </Form.Item>
                  <Form.Item name="a3">
                    <Form.Label>复选框未选中</Form.Label>
                    <Form.Control>
                      <Input />
                    </Form.Control>
                  </Form.Item>
                </>
              )
            }
          }}
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prev, cur) => prev.radio !== cur.radio}>
          {() => (
            <Field name="cc" label={`单选框${formRef.current?.getValues<any>()?.radio}`}>
              <Input placeholder={`结果${JSON.stringify(formRef.current?.getValues<any>())}`} />
            </Field>
          )}
        </Form.Item>
      </Cell.Group>
      <View style={{ margin: "16px" }}>
        <Button shape="round" block color="primary" formType="submit">
          提交
        </Button>
      </View>
    </Form>
  )
}
```

## API

### Form Props

| 参数                          | 说明                                                        | 类型      | 默认值   |
| ----------------------------- | ----------------------------------------------------------- | --------- | -------- |
| defaultValues                 | 表单默认值                                                  | _object_  |          |
| labelAlign <Tag tag="v1.0.5" /> | 表单项 label 对齐方式，可选值为 `center` `right` `top`      | _string_  | `left`   |
| controlAlign                  | 表单项 control 对齐方式，可选值为 `center` `right`          | _string_  | `left`   |
| validateTrigger               | 表单校验触发时机，可选值为 `onChange`、`onSubmit`，详见下表 | _string_  | `onBlur` |
| colon                         | 是否在 label 后面添加冒号                                   | _boolean_ | `false`  |
| required <Tag tag="v1.0.5" /> | 必填星号显示方式，设置为 `auto` 时根据 `rules.required` 自动显示 | _boolean \| 'auto'_ | `false` |
| disabled | 是否禁用表单                                                | _boolean_ | `false`  |

### Form Events

| 事件名         | 说明                       | 回调参数                                              |
| -------------- | -------------------------- | ----------------------------------------------------- |
| onSubmit       | 提交表单且验证通过后触发   | _event: BaseEventOrig&lt;FormProps.onSubmitEventDetail&gt;_ |
| onReset        | 重置表单后触发             | _event: BaseEventOrig_                                |
| onValidate     | 提交表单且验证不通过后触发 | _errors: &#123; name: string, errors: string[] &#125;[]_ |
| onValuesChange | 字段值更新后触发           | _changedValues: object, allValues: object_            |

### Form Methods

通过 ref 可以获取到 Form 实例并调用实例方法。

| 方法名                      | 说明                                                         | 参数                        | 返回值             |
| --------------------------- | ------------------------------------------------------------ | --------------------------- | ------------------ |
| setValues                   | 设置表单值(浅合并)                                           | _object_                    | -                  |
| getValues                   | 获得表单值，支持传入 `name` 来获得单个或部分表单项           | _name?: string \| string[]_ | _object_           |
| setErrors                   | 设置表单验证错误信息(浅合并)                                 | _FormValidError[]_          | _void_             |
| getErrors                   | 获得表单验证错误信息，支持传入 `name` 来获得单个或部分表单项 | _name?: string \| string[]_ | _FormValidError[]_ |
| validate                    | 验证表单，支持传入 `name` 来验证单个或部分表单项             | _name?: string \| string[]_ | _Promise_          |
| submit | 提交表单，与点击提交按钮的效果等价                           | -                           | -                  |
| reset                       | 重置表单                                                     | -                           | _void_             |

### validateTrigger 可选值

通过 `validateTrigger` 属性可以自定义表单校验的触发时机。

| 值       | 描述                                 |
| -------- | ------------------------------------ |
| onSubmit | 仅在提交表单时触发校验               |
| onBlur   | 在提交表单和输入框失焦时触发校验     |
| onChange | 在提交表单和输入框内容变化时触发校验 |

### Form.Item Props

| 参数                              | 说明                                 | 类型                                          | 默认值  |
| --------------------------------- | ------------------------------------ | --------------------------------------------- | ------- |
| name                              | 表单项名称，提交表单的标识符         | _string_                                      | -       |
| defaultValue                      | 表单项默认值                         | _any_                                         | -       |
| required <Tag tag="v1.0.5" /> | 是否显示表单必填星号，设置为 `auto` 时根据自身 `rules.required` 自动显示 | _boolean \| 'auto'_ | `false` |
| rules                             | 表单校验规则                         | _FormRule[]_                                  | -       |
| dependencies | 当依赖的字段值改变时，触发自身的校验 | _string[]_                                    | -       |
| shouldUpdate | 当值为 true 时，触发当前区域重新渲染 | _boolean\|(prevValues, curValues) => boolean_ | -       |
| noStyle      | 直接渲染 children                    | boolean                                       | -       |

> 属性继承自 Cell 组件，更多属性参见：[Cell 组件](/components/cell/#cell-props)

### Rule 数据结构

使用 Form.Item 的 `rules` 属性可以定义校验规则，可选属性如下：

| 键名 | 说明 | 类型 |
| --- | --- | --- |
| required | 是否为必选字段，当值为空字符串、空数组、`undefined`、`null` 时，校验不通过 | _boolean_ |
| message | 错误提示文案 | _string \| (value, rule) => string_ |
| validator | 通过函数进行校验 | _(value, rule) => boolean \| string \| Promise_ |
| validateFirst | 当某一规则校验不通过时，是否停止剩下的规则的校验。 | _boolean_ |
| pattern | 通过正则表达式进行校验 | _RegExp_ |
| trigger | 本项规则的触发时机，可选值为 `onChange`、`onBlur` | _string_ |
| formatter | 格式化函数，将表单项的值转换后进行校验 | _(value, rule) => any_ |

### Form.Label Props

| 参数  | 说明                                | 类型      | 默认值  |
| ----- | ----------------------------------- | --------- | ------- |
| align <Tag tag="v1.0.5" /> | 对齐方式，可选值为 `center` `right` `top` | _string_  | `left`  |
| colon | 是否在 label 后面添加冒号           | _boolean_ | `false` |

### Form.Feedback Props

| 参数   | 说明                                           | 类型     | 默认值 |
| ------ | ---------------------------------------------- | -------- | ------ |
| align  | 对齐方式，可选值为 `center` `right`            | _string_ | `left` |
| status | 反馈状态，可选值为 `valid` `warning` `invalid` | _string_ | -      |

### Form.Control Props

| 参数     | 说明                                | 类型                                                        | 默认值 |
| -------- | ----------------------------------- | ----------------------------------------------------------- | ------ |
| align    | 对齐方式，可选值为 `center` `right` | _string_                                                    | `left` |
| children | 内容                                | _ReactNode\|((controller: FormController&lt;V&gt;) => ReactNode)_ | --     |

```tsx
interface FormController<V> {
  value?: V // 当前表单项值
  validateStatus?: FormValidateStatus // 当前表单项验证状态
  disabled?: boolean // 当前表单项是否禁用

  onChange?(value: V): void // 改变当前表单项值

  onBlur?(value: V): void // 触发onBlur当前表单项校验
}
```

> Tips: 使用 onBlur 触发表单验证，自定义表单项时，要手动调用 onBlur，才能触发校验

### Form.List

| 参数         | 说明                         | 类型                                                                                 |
| ------------ | ---------------------------- | ------------------------------------------------------------------------------------ |
| children     | 渲染函数                     | _(fields: &#123; key: string, name: string &#125;[], operation: &#123; add, remove &#125;) => ReactNode_ |
| name         | 表单项名称，提交表单的标识符 | _string_                                                                             |
| defaultValue | 表单项默认值                 | _any_                                                                                |

### 类型定义

通过`@taroify/core/form`导入组件类型：

```tsx
import { FormRule, FormItemInstance, FormListInstance, FormInstance } from "@taroify/core/form"
```

## 主题定制

### 样式变量

组件提供了下列 CSS 变量，可用于自定义样式，使用方法请参考 [ConfigProvider](/components/config-provider/) 组件。

| 名称                               | 默认值                    | 描述 |
| ---------------------------------- | ------------------------- | ---- |
| form-label-width                   | _6.2em_                   | -    |
| form-label-color                   | _var(--gray-7)_           | -    |
| form-label-margin-right            | _var(--padding-sm)_       | -    |
| form-label-top-margin-bottom <Tag tag="v1.0.5" /> | _var(--padding-base)_     | -    |
| form-label-disabled-color          | _var(--gray-5)_           | -    |
| form-item-icon-size                | _16px \* $hd_             | -    |
| form-item-right-icon-color         | _var(--gray-6)_           | -    |
| form-item-right-icon-padding       | _0 var(--padding-xs)_     | -    |
| form-item-right-icon-margin-right  | _-8px \* $hd_             | -    |
| form-item-right-button-margin-left | _var(--padding-xs)_       | -    |
| form-control-color                 | _var(--text-color)_       | -    |
| form-control-min-height            | _var(--cell-line-height)_ | -    |
| form-feedback-font-size            | _var(--font-size-sm)_     | -    |
| form-feedback-valid-color          | _var(--success-color)_    | -    |
| form-feedback-warning-color        | _var(--warning-color)_    | -    |
| form-feedback-invalid-color        | _var(--danger-color)_     | -    |
