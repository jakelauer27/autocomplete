const Node = require('./Node');

class Trie {
  constructor() {
    this.wordCount = 0;
    this.root = new Node().children;
  }

  insert(word) {
    let letters = word.split('');
    let currentNode = this.root;

    while (letters.length) {
      let currentLetter = letters.shift();

      if (!currentNode[currentLetter]) {
        currentNode[currentLetter] = new Node();
      }

      if (!letters.length && !currentNode[currentLetter].completeWord) {
        this.wordCount++;
        currentNode[currentLetter].completeWord = word;
      }

      currentNode = currentNode[currentLetter].children;
    }
  }

  traverseDown(word) {
    // Split the word into an array so we can traverse down to the last letter
    let letters = word.split('');

    // Start our traversal at the root node
    let currentNode = this.root;

    // While we still have letters to traverse down to
    while (letters.length) { 
      // shift off the first one
      let currentLetter = letters.shift();

      // try to find the currentLetter in the children of our currentNode
      let foundLetter = Object.keys(currentNode).find(letter => 
        letter === currentLetter);

      // if it finds it, reset the current node to that child's children
      if (foundLetter) {
        currentNode = currentNode[currentLetter].children;
      }
    }

    // Once the while loop has finished, return whatever our currentNode landed on
    return currentNode;
  }

  findWords(currentNode, suggestions) {
    // grab any children letters from our current Node
    let letters = Object.keys(currentNode);

    // loop through all of our letters
    letters.forEach(letter => {
      // if we find a complete word, push that word into our suggestions array
      if (currentNode[letter].completeWord) {
        suggestions.push(currentNode[letter].completeWord);
      }

      // if there are more children beneath our currentNode[letter]
      if (Object.keys(currentNode[letter].children).length) {
        // recursively call findWords to dig into that branch and find any completeWords
        // passing in the updated suggestions array so we can continue to build on it
        this.findWords(currentNode[letter].children, suggestions);
      }
    });

    // return the final suggestions array
    return suggestions;
  }

  suggest(prefix) { 
    let currentNode = this.traverseDown(prefix);

    return this.findWords(currentNode, []);
  }

  populate(words) {
    words.forEach(word => this.insert(word));
  }
}

module.exports = Trie;