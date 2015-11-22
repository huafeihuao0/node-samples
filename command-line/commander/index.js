#!/usr/bin/env node

// 源码中通过 `exports = module.exports = new Command();` 暴露的是Command实例
var program = require('commander');

program
	// version()是commander在内部注册了"-V, --version"功能选项，还有一个就是"-h, --help"
	// 便利方法，相当于.option('-V, --version', 'output the version number')
	// 传第2个参数可改变flag
    .version('0.0.1', '-V, --version')

    .usage('test')

    // 指定参数的语法
    //.arguments('<cmd> [env]')

    // option()用于定义选项功能。
    // 构造函数: Command.prototype.option = function(flags, description, fn, defaultValue) {}
    //     flags: 第一个参数是标志字符串，分为短标志和长标志，以逗号、管道符(|)或空格间隔
    // 	   description: 描述选项功能
    // 	   fn: 回调函数(函数/正则表达式/默认值)，对参数做处理，可以是内置函数，如parseInt
    //     defaultValue: 默认值
    // 如果有"<n>"这种形式的flag, 必须传参数。源码: this.required = ~flags.indexOf('<');
    .option('-i, --integer <n>', '整数参数', parseInt)
    .option('-l, --list [items]', '指定列表默认为 1,2,3', list, [1,2,3])
    // 如果是"[value]"这种形式的flag, 为可选参数。源码: this.optional = ~flags.indexOf('[');
    .option('-o, --optional [value]', '可选值')
    // 初始值为0
    .option('-v, --verbose', '在默认值上+1', increaseVerbosity, 0)
    // 当是"--no-*"的形式，该option的实例属性bool会被设置为false, defaultValue会被设置为true。
    // 使用场景: 存在一个选项的否定项，如下示例使用-T则program.tests为false，程序中作相应逻辑处理
    // 相关源码:
    // `this.bool = !~flags.indexOf('-no-');`
    // `if (false == option.bool) defaultValue = true;`
    .option('-T, --no-tests', '忽略测试')

    // 正则表达式。如果不满足第三个参数的正则表达式，则使用第四个参数的默认值
    .option('-d --drink [drink]', 'Drink', /^(coke|pepsi|izze)$/i, 'coke');

program
	// 设置命令名。使用: ./index.js setup dev
	.command('setup [env]')
    .description('在所有环境中运行setup命令')
    // $ ./index.js setup dev -s 装13
    .option("-s, --setup_mode [mode]", "设置要使用的模式")
    // .action()当在program.args中指定command名时会被调用
    .action(function(env, options){
    	var mode = options.setup_mode || "正常";
    	env = env || '所有';
    	console.log('在 %s 环境中使用 %s 模式', env, mode);
    })
    // 给setup设置帮助信息。使用: ./index.js setup -h
    .on('--help', function() {
	    console.log('  Examples:');
	    console.log();
	    console.log('    $ ./index.js setup dev');
	    console.log('    $ ./index.js setup dev -s normal');
	    console.log();
	 });

program
    // 可变参数。使用: ./index.js rmdir /bin ~/Documents
    // 一个命令的最后一个参数可以是可变参数, 并且只能是最后一个参数。为了使参数可变，你需要在参数名后面追加 ...。
    .command('rmdir <dir> [otherDirs...]')
    .action(function (dir, otherDirs) {
        console.log('rmdir: %s', dir);
        if (otherDirs) {
            otherDirs.forEach(function (oDir) {
              console.log('rmdir: %s', oDir);
            });
        }
    });

program
	// command名为*时, 只要输入不存在的command名就会执行其下的action
    .command('*')
    .description('部署指定环境')
    .action(function(env) {
    	console.log('正在部署 "%s"', env);
    });    

// 定义全局帮助信息(必须在 program.parse() 之前设置)。使用: ./index.js -h
program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    $ custom-help --help');
  console.log('    $ custom-help -h');
  console.log('');
});

// 解析来自 progress.argv 指定的参数和选项，
program.parse(process.argv);

// ===== 辅助 =====

function list(val) {
  return val.split(',');
}

function increaseVerbosity(v, total) {
  return total + 1;
}


// ===== 输出 =====

// $  ./index.js -h
// 自动化帮助信息，列出所有选项目功能及描述

// $  ./index.js -i 123abc
// => int: 123
console.log('int: %j', program.integer);

// $  ./index.js -l 1,2,a,b
// => list: ["1","2","a","b"]
console.log('list: %j', program.list);

// $  ./index.js -v
// => verbosity: 1
console.log('verbosity: %j', program.verbose);

// $  ./index.js -T
// =>  no-tests: false
console.log('no-tests: %j', program.tests);

// $  ./index.js -d unexist
// => drink: "coke"
console.log('drink: %j', program.drink);

// 剩余不属于任何功能选项的参数放到 program.args 数组中。
// $  ./index.js -i 1 other params unused
// => unused params: ["other","params","no","used"]
console.log('unused params: %j', program.args);

// 不加任务参数运行也会输出帮助信息 `./index.js` 与 `./index.js -h` 等效
// 由于它在执行完之后会执行process.exit(), 所有放在最后。
if (!program.args.length) program.help();
