# API 文档

这些函数可以被用在`JSMD`中的任意地方，通过`Javascript`和`Web`浏览器来改善`工作流`。

注：请直接就[我们的问题](https://github.com/iodide-project/iodide/issues/new)的不准确之处提出意见。

## `iodide.addOutputRenderer(rendererSpecification)`

给`Iodide`添加一个自定义的`renderer`输出。

指定的输出`renderer`是一个对象，它有`shouldRender` 和 `render` 两个函数。

* `shouldRender` 接受一个参数值，然后以某种方式监视他。如果`rednerer`应该处理这个值，返回`true`；否则返回`false`。
* `render` 接受一个参数值，返回一个`HTML`字符串。

当用户定义的`cell`有返回值时， `iodide.addOutputRenderer` 会按照`renderer`的规范，并添加用户自定义的`cell`(JSMD中的`chunk`代码)的输出，它会在用户自定义的`renderer`的`_end_`被检测。

在下面的例子中，`renderer`会监视`lat`值和`lon`键，如果它们存在，输出一个以坐标为中心的映射。

```javascript
const GeoLocationOutputRenderer = {
  shouldRender: (value) => (
    return typeof value === "object" && "lat" in value && "lon" in value;
  ),
  render: (value) => (
    `<img src="http://staticmap.openstreetmap.de/staticmap.php?center=${value.lat},${value.lon}&zoom=17&size=300x200&maptype=mapnik"/>`
  ),
};

iodide.addOutputRenderer(GeoLocationOutputRenderer);
```



## `iodide.clearOutputRenderers()`

清除所有用户自定义的且被添加到`Iodide`会话的`renderer`输出（通过`iodide.addOutputRenderer(rendererSpecification)`实现的）。

## `iodide.output`

`iodide.output` API是一个方便的函数，你可以通过编程的方式向你的`报表`（输出显示）添加一个DOM元素，而不用将它们显示的添加到`Markdown`模块中。

使用这些函数创建的DOM元素，会按照它们出现在`JSMD`中的位置，顺序插入到`报表`中。重要的是，创建元素的代码块提供了一个键，允许`Iodide`跟踪元素的位置。如果使用这些函数计算生成DOM元素后，更改代码块将导致从`报表`中删除该元素，你将不得不再次计算代码块以刷新该元素。(这可以确保在进行代码更改时不会留下过时的DOM元素)

这些方便的函数仅适用于同步`render`。如果要异步的使用它们，DOM元素被添加到`报表`中的位置，将是随机的，会出现不可预料的结果。如果你非要适用异步操作DOM元素，建议你显式地将目标DOM元素放置在`Markdown 块`中。

### `iodide.output.element(nodeType)`

这个函数为你的`报表`创造一个`nodeType`类型的DOM元素，然后返回这个元素的引用。你可以像操作其它Web元素一样，使用标准的`Web API`来操作它。

### `iodide.output.text(string)`

这个函数接受一个`string`类型的值，如果这个字符串值是多行显示的话，就分割它，并为每行的值添加一个`div`包含之，最后将这多行的结果添加到`报表`中。
