var replServer = require('repl').start('> ');

replServer.on('exit', ()=> {
  console.log('Got "exit" event from repl!')
})
.on('reset', (context) => {
  console.log('repl has a new context');
})
.defineCommand('sayhello', {
  help: 'Say hello',
  action: function(name) {
console.log(arguments);
    this.write(`Hello, ${name}!\n`);
    this.displayPrompt();
  }
});
