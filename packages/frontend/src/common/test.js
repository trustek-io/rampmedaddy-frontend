class TrieNode {
  constructor() {
    this.children = {}
    this.isEndOfWord = false
    this.items = []
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode()
  }

  insert(word, item) {
    let node = this.root
    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode()
      }
      node = node.children[char]
      node.items.push(item) // Keep reference to item in each node
    }
    node.isEndOfWord = true
  }

  search(word) {
    let node = this.root
    for (let char of word) {
      if (!node.children[char]) {
        return []
      }
      node = node.children[char]
    }
    return node.items
  }
}
