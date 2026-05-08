function success(message) {
  console.log(`✔ ${message}`);
}

function note(message) {
  console.log(`→ ${message}`);
}

function printKeyValueList(items) {
  for (const item of items) {
    console.log(`- ${item.key}: ${item.value}`);
  }
}

module.exports = {
  success,
  note,
  printKeyValueList,
};
