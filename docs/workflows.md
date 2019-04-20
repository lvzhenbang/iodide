# 工作流程和知识点

## ` Iodide notebook `如何获取数据

`Iodide`可以使用`JavaScript`和标准的浏览器`API`，通过`公共的URL`来下载WEB上的数据。为了便于获取数据，在`JSMD`中提供了一个`fetch 模块`, 你可以通过它来加载数据。更多的` JSMD fetch 模块 `语法，可参考[JSMD 文档](jsmd.md)。

### 从服务器获取数据

可以通过浏览器的`API`或者`fetch chunk`来获取存储于服务器的数据。可参考[` JSMD 文档 `](jsmd.md)中`fetch 模块`这一部分所提供的示例。

#### CORS 问题

通常`Iodide`在下载来自远程服务器的数据的时候会遇到[`CORS settings`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)问题, 它限制了`Iodide`现在其它站点儿数据的能力。不幸的是，出于安全性考虑，浏览器不能[`CORS`](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Functional_overview)。如果加载的数据来自第三方服务器，并且不能获得所需要的数据，由于`Iodide`不能给你任何提示，此时你需要打开你的浏览器开发者工具(按 `ctrl+shift+i`)，如果是一个`CORS`问题，你会看到如下信息： 

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at {URI of resource you tried to load}.
(Reason: CORS request did not succeed).
```

运行中出现`CORS`错误，你需要把你的数据上传到一个不会引起`CROS`的服务器。我们推荐使用`Iodide`服务器或者[GitHub Gist](https://gist.github.com/)。上传你的文件到`gist`，复制一个`raw`，例如：`https://gist.githubusercontent.com/{你的用户名}/{你的gist id}/raw`

### 上传一个记录数据的`notebook`

注：(2019-03-11) 我们知道这个工作流程有点儿别扭。它正在积极发展中，并将很快得到大幅度改善。

注：(2019-03-11)在测试阶段文件不能大于10MB。

如果你将数据存储在本地或者存在远程服务器，你可能会遇到一个`CORS`问题。建议将数据上传到`Iodide`。

数据是被上传到一个单独的、指定的`notebook`，而不是你的账户。这时，你需要切换到你的`notebook`的`revisions`页面，如： `iodide.io/{你的notebook路径}/revisions`。到了这个页面，单击`gear`按钮，选择` Upload a File `。如果上传成功，你将会在` Files `的列表中看到。

在`notebook`中实现加载一个文件：

```
%% fetch
TYPE: VAR_NAME = files/FILE_NAME
```

注： `TYPE` 指文件类型（如："text", "json", 或 "blob"），`VARNAME` 指加载的数据，`FILE_NAME` 指文件的名称。

[`demo `](https://alpha.iodide.io/notebooks/127/) // 加载和使用`iamge blob`

## DOM操作

一些可视化图像库(如：`d3` 或 `Plotly`) 需要一个DOM元素，才能完成绘制图像的功能。最简单的方法是在一个`Markdown`模块中`，添加 ``<div>` ，然后用浏览器`API`或者你喜欢的第三方库来获取这个元素：

```plain
%% md
<div id=’plot-target’></div>

%% js
elt1 = document.getElementById("plot-target") // browser API, one option...
elt2 = document.querySelector("#plot-target") // browser API, another option
$("#plot-target") ... // jQuery
d3.select("#plot-target") ... // d3
```

你可以操作`Markdown`模块中的DOM，就好像操作一个静态的`*.html`中的一样。任何定义在`Markdown`中的内容，都可以通过浏览器提供的[` document API `](https://developer.mozilla.org/en-US/docs/Web/API/Document)来实现DOM操作。

