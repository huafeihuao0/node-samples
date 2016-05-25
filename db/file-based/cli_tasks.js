var fs = require('fs');
var path = require('path');

var args = process.argv.splice(2);
var command = args.shift();
var taskDescription = args.join(' ');
var file = path.join(process.cwd(), '/tasks.txt');

/**
 * 列出任务列表：node cli_tasks.js list
 * 添加任务：   node cli_tasks.js add task1
 */
switch(command) {
  case 'list':
    listTasks(file);
    break;

  case 'add':
    addTask(file, taskDescription);
    break;

  default:
    console.log('Usage: ' + process.argv[0]
      + ' list|add [taskDescription]');
}

// 从文本文件中加载编码为JSON格式的数据
function loadOrInitializeTaskArray(file, cb) {
  createTaskFile(function(err) {
    if (err) throw err;

    // 读取待办事项数据
    fs.readFile(file, 'utf8', function(err, data) {
      if (err) throw err;

      cb(JSON.parse(data.toString() || '[]'));
    });
  });
}

function listTasks(file) {
  loadOrInitializeTaskArray(file, function(tasks) {
    for(var i in tasks) {
      console.log(tasks[i]);
    }
  });
}

function storeTasks(file, tasks) {
  fs.writeFile(file, JSON.stringify(tasks), 'utf8', function(err) {
    if (err) throw err;
    console.log('Saved.');
  });
}

function addTask(file, taskDescription) {
  loadOrInitializeTaskArray(file, function(tasks) {
    tasks.push(taskDescription);
    storeTasks(file, tasks);
  });
}

// 如果文件不存在，则创建文件
function createTaskFile(cb) {
  try {
    // fs.F_OK可以用于检测文件是否存在
    fs.accessSync(file, fs.F_OK);
    cb();
  } catch (err) {
    // 文件不存在
    if(err.code === 'ENOENT') {
      fs.writeFileSync(file, '');
      cb(null);
    }else {
      cb(err);
    }
  }
}
