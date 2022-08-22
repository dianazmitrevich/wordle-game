const tileDisplay = document.querySelector('.tile-container')
const messageDisplay = document.querySelector('.message-container')
const keyboard = document.querySelector('.key-container')

let wordle

const getWordle = () => {
   fetch('http://localhost:8000/word')
      .then(response => response.json())
      .then(json => {
         console.log(json)
         wordle = json.toUpperCase()
      })
      .catch(err => console.log(err))
}

getWordle()

const keys = [
   'Q',
   'W',
   'E',
   'R',
   'T',
   'Y',
   'U',
   'I',
   'O',
   'P',
   'A',
   'S',
   'D',
   'F',
   'G',
   'H',
   'J',
   'K',
   'L',
   'ENTER',
   'Z',
   'X',
   'C',
   'V',
   'B',
   'N',
   'M',
   '<<'
]

const quessRows = [
   ['', '', '', '', ''],
   ['', '', '', '', ''],
   ['', '', '', '', ''],
   ['', '', '', '', ''],
   ['', '', '', '', ''],
   ['', '', '', '', '']
]

let currentRow = 0
let currentTile = 0
let isGameOver = false

quessRows.forEach((quessRow, quessRowIndex) => {
   const rowELement = document.createElement('div')
   rowELement.setAttribute('id', 'quessRow-' + quessRowIndex)
   quessRow.forEach((quess, quessIndex) => {
      const tileElement = document.createElement('div')
      tileElement.setAttribute('id', 'quessRow-' + quessRowIndex + '-tile-' + quessIndex)
      tileElement.classList.add('tile')
      rowELement.append(tileElement)
   })
   tileDisplay.append(rowELement)
})

keys.forEach(key => {
   const buttonElement = document.createElement('button')
   buttonElement.textContent = key
   buttonElement.setAttribute('id', key)
   buttonElement.addEventListener('click', () => handleClick(key))
   keyboard.append(buttonElement)
})

const handleClick = (letter) => {
   if (!isGameOver) {
      console.log('clicked ' + letter)
      if (letter == '<<') {
         deleteLetter()
         return
      }
      if (letter == 'ENTER') {
         checkRow()
         return
      }
      addLetter(letter)
   }
}

const addLetter = (letter) => {
   if (currentTile < 5 && currentRow < 6) {
      const tile = document.getElementById('quessRow-' + currentRow + '-tile-' + currentTile)
      tile.textContent = letter
      quessRows[currentRow][currentTile] = letter
      tile.setAttribute('data', letter)
      currentTile++
   }
}

const deleteLetter = () => {
   if (currentTile > 0) {
      currentTile--
      const tile = document.getElementById('quessRow-' + currentRow + '-tile-' + currentTile)
      tile.textContent = ''
      quessRows[currentRow][currentTile] = ''
      tile.removeAttribute('data')
   }
}

const checkRow = () => {
   const quess = quessRows[currentRow].join('')

   if (currentTile > 4) {
      /*fetch(`http://localhost:8000/check/?word=${quess}`)
         .then(response => response.json())
         .then(json => {
            console.log(json)
            if (json == 'Entry word not found') {
               showMessage('Word is not on a list')
               return
            }
            else {*/
      flipTile()
      if (wordle == quess) {
         showMessage('Cool')
         isGameOver = true
         return
      }
      else if (currentRow >= 5) {
         showMessage('Game over')
         isGameOver = true
         return
      }
      if (currentRow < 5) {
         currentRow++
         currentTile = 0
      }
      //}
      //})
   }
}

const showMessage = (message) => {
   const messageElement = document.createElement('p')
   messageElement.textContent = message
   messageDisplay.append(messageElement)
   setTimeout(() => messageDisplay.removeChild(messageElement), 1500);
}

const flipTile = () => {
   const rowTiles = document.querySelector('#quessRow-' + currentRow).childNodes
   let checkWordle = wordle
   const quess = []

   rowTiles.forEach(tile => {
      quess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' })
   })

   quess.forEach((quess, index) => {
      if (quess.letter == wordle[index]) {
         quess.color = 'green-overlay'
         checkWordle = checkWordle.replace(quess.letter, '')
      }
   })

   quess.forEach(quess => {
      if (checkWordle.includes(quess.letter)) {
         quess.color = 'yellow-overlay'
         checkWordle = checkWordle.replace(quess.letter, '')
      }
   })

   rowTiles.forEach((tile, index) => {
      setTimeout(() => {
         tile.classList.add('flip')
         tile.classList.add(quess[index].color)
         addColorToKey(quess[index].letter, quess[index].color)
      }, 500 * index)
   })
}

const addColorToKey = (keyLetter, color) => {
   const key = document.getElementById(keyLetter)
   key.classList.add(color)
}