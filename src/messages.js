const nlp = require('compromise');
const commands = require('./commands');
const messages = require('./src/messages.js');

const handleMessage = function (message) {
  let command = nlp(message).match("Give me [(#Value|a|an) #Noun+]");
  if (command.found) {
    console.log(command.out())
    command = nlp(command.out())
    let count = command.values().toNumber().out();
    if (!isNaN(parseInt(count, 10))) {
      count = parseInt(count, 10);
    } else {
      count = 1;
    }
    console.log(command.nouns().out());
    let noun = command.nouns().toSingular().out().trim();
    
    let values = commands.run(noun.replace(/\s+/g, '_'), {}, count);
    if (values) {
      return `On it! count = ${count}, noun = ${noun}\n${values.join("\n")}`;
    } else {
      return `I don't know how to make a ${noun}.`
    }
  }
}

module.exports = {
  handleMessage: handleMessage
}