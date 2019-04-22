# JSMD 格式

## JSMD 是什么？

JSMD是`JavaScript MarkDown`的简称，是一个Iodide的`notebook`文件格式。. 它提供了一种方法，让你的`notebook`中既可以写`Markdown`，也可以写入`Javascript`，也可以通过使用其他语言的插件来使用其它语言，如：Python 或 OCaml。

这种文件格式的灵感来自于`MATLAB`的 "cell mode" 和 [`.Rmd`](https://rmarkdown.rstudio.com/r_notebooks.html)
(RMarkdown notebook) 文件。它是一个不同语言内容的集合。通过 `%%` 来区分，并且知识该内容模块所使用的语言。

Iodide的`notebook`是一个纯文本，它方便了人类和计算机的理解。 它可以使用开箱即用的``dif`和Github的`pull reqeuest`，来提交新内容。

## JSMD 的语法和用法

正如上面所说的那样，一个`JSMD`文件就是一个纯文本文件，通过每行开始的`%%`区分所使用的不同语言。

对于`JSMD`，你需要注意以下几点儿：

* Iodide的`JSMD`支持如下的`chunk`类型：
    * `%% js` 代表Javascript
    * `%% py` 代表 Python
    * `%% md` 代表 Markdown
    * `%% css` 代表 CSS 样式
    * `%% fetch` 代表可以从服务器获取的资源
    * `%% plugin` 代表`Iodide`插件
    * `%% raw` 代表`Iodide`将忽视的内容
* 如果一个块开始处只有' %% '，但没有明确的指定`chunk`的类型，那么它将继承它上面`chunk`的类型。
* 任可带有`Iodide`不能识别的类型，都将会被忽略。
* 每一个`chunk`上面的空白行都将被忽略。
* `md` 和 `css` 块的任何改变都将会被立即运用到`Iodide`的`报表`。而其它块的改变需要先通过计算，然后才能显示在`报表`中，可以使用 `ctrl+enter`/`shift+enter` 快捷键来完成`计算`，也可以使用工具栏中的按钮来触发`计算`。
* 可以为模块`分割符`添加一个或者多个`标识符`来修改它们的行为。例如： `%% js skipRunAll` 将阻止当前模块的运行。如果一个模块包含`修饰符`，那么该模块的`分隔符`中必须包含模块的`类型`标志。

下面的例子列举了可用的模块修饰符，它说明了这些修饰符的用途，以及它们之间的细微差别：

```
// 位于顶部的这些内容将被忽略

%% md
# 这是 markdown
这部分的内容，只要你改变它，它就会被渲染
%% js
function bigSlowFunction(x){ ... }

%% 
// 因为这个`块`的类型未指定，所以它将继承上面模块的`JS`类型

// 当你运行某个代码片段时(例如，如果它非常慢)，你可以使用这样的`块`分割方式
// 来调整模块
let sum = 0
for (var i = 0; i < 1e10; i++) {
  sum = sum + bigSlowFunction(x)
}

%% qwerty
这是一种`Iodide`无法识别的块类型，所以它将会被忽略。

```

## JSMD 的`块`种类

### Markdown (`%% md`)

`Markdown` 允许你适用[` Markdown 语法 `](https://commonmark.org/help/) ([full spec](https://spec.commonmark.org/))书写代码。它直接在你的`报表`预览中显示。

`Markdown`支持`HTML`语法，也就是说，你可以在`Markdown`的`块`中直接使用`HTML`代码。稍后，你可以在你的脚本中操作它。如下所示：

```
% md
# Section title

A paragraph introducing the topic.

<div id="plot-1"></div>

A paragraph describing plot-1.
```

我们可以使用标准的浏览器API，通过操作 `div#plot-1` ，来操作元素。如：在 `div` 内添加一个 [d3](https://d3js.org/) 或 [plotly](https://plot.ly/javascript/)。

注： 但是，如果更新了标记块，则对放置在标记块内的DOM元素所做的任何编程更改都将被覆盖；在这种情况下，你需要重新评估负责DOM操作的代码块。

Markdown块还支持[LaTeX](https://en.wikibooks.org/wiki/LaTeX/Mathematics)用于排版数学。LaTeX表达式可以放在单美元符号之间的行内(` $…$ `)，或者放在双美元符号之间的块中(` $$…$$ `)。

```
# Derivatives

Let's begin by discussing an $\epsilon$-$\delta$ argument, then we'll turn to the limit:

$$\lim_{h\to 0} \frac{f(x+h)-f(x)}{h}.$$

```

### JavaScript (`%% js`)

JavaScript块允许你输入`Javascript`代码，并且可以在浏览器中执行。代码运行在`报表`的范围内(在代码编辑器中的一个单独的[iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)，并允许你使用浏览器中所有的[Web API](https://developer.mozilla.org/en-US/docs/Web/API)。

块中代码执行后，返回的最后一个值是显示在Iodide控制台中。

### CSS (`%% css`)

CSS块允许你输入[` CSS 样式 `](https://developer.mozilla.org/en-US/docs/Web/CSS) 来改变`报表`的外观。当你改变你的`css`块时，与之对应的`Markdown`这样的块会被立即`计算`。

### Fetch块 (`%% fetch`)

Fetch块提供了一种便利的方法（如：`fetch`）向`Iodide`环境中加载外部的资源。目前，支持如下的加载：

* JavaScript库(不支持npm模块库)
* 样式文件
* 数据 (如： JSON, text, 或 blobs)

在每个fetch`cell`前要加上如下内容:

1. `fetch type`, 如： `js`, `css`, `json`, `text` 或 `blob`,
2. 将要被获取的资源的`url`。

而获取如：`json`, `text` 或 `blob`这样的数据，一定要指定存储数据的变量名。

下面是一个`fetch`模块的示例：

```
%% fetch
// NOTE js style comments are allowed as well
js: https://cdnjs.cloudflare.com/ajax/libs/d3/4.10.2/d3.js
css: https://www.exmpl.co/a_stylesheet.css  // end of line comments are ok too
text: csvDataString = https://www.exmpl.co/a_csv_file.csv
json: jsonData = https://www.exmpl.co/a_json_file.json
blob: blobData = https://www.exmpl.co/a_binary_blob.arrow
```
所有被请求的资源都是并行(异步)下载的，但是如果要对多个计算值进行排队，则在所有资源可用之前不会对下面的块进行计算。这允许你在同步的工作流中管理资源的检索，而不必处理`Web api`的异步特性(当然，如果需要额外的控制，你可以使用JavaScript代码和这些api来管理这种复杂性)。

如果是`js`和`css`类型，那么脚本和样式表一旦可用，就会立即被添加到环境中。

其它遵循 `{TYPE}: {VAR_NAME} = {RESOURCE_URL}`语法的类型，数据被加载到JavaScript作用域中的变量` VAR_NAME `中。在`json`获取的情况下，从URL检索的json对象被解析为原生JavaScript对象，但是在`text`和`blob`获取的情况下，变量将分别包含一个原始字符串或[blob对象](https://developer.mozilla.org/en-US/docs/Web/API/Blob)。


### Pyodide (`%% py`)

Pyodide块使用[Pyodide](https://github.com/iodide-project/pyodide)，从而允许你使用`Python 3`的语法，Python的解释器会将该模块的代码解析成为WebAssembly来供浏览器使用。

注：当你第一次`计算` `py` 块时，python一定要被下载和初始化，这样会花费一些时间。而后续的`py`块会被立即`计算`。

Pyodide被当作一个`Iodide`的[`语言插件`](language_plugins.md)实现了。

### Plugins (`%% plugin`)

插件模块允许你引入插件来扩展`Iodide`的功能。目前，`Iodide`仅支持[` 语言插件 `](language_plugins.md), 它会为`Iodide 会话`添加其它语言的解释器。

插件`块`必须包含一个包含插件规范的JSON字符串。JSON必须包含一个`type`字段(目前必须是`language`)。

## 块的修饰符

`块`的`修饰符`可以是一个也可以是多个，如果一个`修饰符`被包含在分隔符中，那么这个`分隔符`一定要包含`类型符`。

### `skipRunAll`

目前，惟一可用的标志是`skipRunAll`。

这对于你在探索性研究期间，编写和运行计算开销较大的代码执行工作流来说非常有用。但是你不希望，当读者在报表视图中访问你的记事本时自动运行这些代码。例如，笔记本的顶部可能加载和处理数据，将较小的中间数据集上载到服务器，然后只下载要立即显示在报表视图中的小数据集。这个工作流程允许你创建一个`报表`，为你的读者快速加载，同时将你的探索性代码保存在你的笔记本中。

