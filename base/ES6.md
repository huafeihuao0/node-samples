- [ECMAScript 2015 (ES6) in Node.js](https://nodejs.org/en/docs/es6/)
- [ECMAScript 6 features](https://github.com/lukehoban/es6features)
- [ECMAScript 6入门](http://es6.ruanyifeng.com/)
- [node-es6-examples](https://github.com/JustinDrake/node-es6-examples/blob/master/README-zh.markdown)  

### 简介

使用下面的命令，可以查看Node所有已经实现的ES6特性。  
```shell
node --v8-options | grep harmony
```

> 访问ruanyf.github.io/es-checker，可以看到默认浏览器支持ES6的程度。

#### Babel转码器

[Babel](http://babeljs.io/)是一个广泛使用的ES6转码器，可以将ES6代码转为ES5代码，从而在浏览器或其他环境执行。  

**安装**  

`npm install --global babel-cli`  

**命令行环境**  

- Babel自带一个`babel-node`命令，提供支持ES6的REPL环境。它支持Node的REPL环境的所有功能，而且可以直接运行ES6代码。
- `babel-node`命令也可以直接运行ES6脚本。  
- babel命令可以将ES6代码转为ES5代码。
  - -o参数将转换后的代码，从标准输出导入文件。`babel es6.js -o es5.js`  
  - -d参数用于转换整个目录。`babel -d build-dir source-dir` (注意，-d参数后面跟的是输出目录。)
  - -s参数用于生成source map文件。

**浏览器环境**

`npm install babel-core`  

> 在当前目录的`node_modules/babel-core/`子目录里面，找到babel的浏览器版本`browser.js`（未精简）和browser.min.js（已精简）。然后，将其中一个插入网页。**但是建议不这么做: 这种写法是实时将ES6代码转为ES5，对网页性能会有影响**  

Babel配合Browserify一起使用，可以生成浏览器能够直接加载的脚本。

$ browserify script.js -t babelify --outfile bundle.js
上面代码将ES6脚本script.js，转为bundle.js。浏览器直接加载后者就可以了，不用再加载browser.js。

在`package.json`设置下面的代码，就不用每次命令行都输入参数了。  

```js
{
  // ...
  "browserify": {
    "transform": [
      ["babelify", { "stage": [0] }]
    ]
  }
}
```

**Node环境**  

先安装`babel-core`:  
`npm install --save-dev babel-core`  

然后在脚本中，调用babel-core的transform方法。  

```js
require("babel-core").transform("code", options);
```

> 上面代码中，transform方法的第一个参数是一个字符串，表示ES6代码。  

Node脚本还有一种特殊的babel用法，即把babel加载为require命令的一个钩子。先将babel全局安装。

`$ npm install -g babel`  

然后，在你的应用的入口脚本（entry script）头部，加入下面的语句。  

`require("babel/register");`  

有了上面这行语句，后面所有通过require命令加载的后缀名为`.es6`、`.es`、`.jsx`和`.js`的脚本，都会先通过babel转码后再加载。


**在线转换**  

- Babel提供一个[REPL在线编译器](https://babeljs.io/repl/)  
- Google的[Traceur在线编译器](http://google.github.io/traceur-compiler/demo/repl.html)
