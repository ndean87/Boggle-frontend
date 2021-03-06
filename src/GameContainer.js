import React, {Component} from 'react'
import WordList from './WordList.js'
import Footer from './Footer.js'
import Board from './Board.js'
import Timer from './Timer.js'
import StartButton from './StartButton.js'
import GameEndPopUp from './GameEndPopUp.js'

const BASE_URL = "https://boggle-backend.herokuapp.com"
// const BASE_URL = "http://localhost:3000/"


class GameContainer extends Component {

  state = {
    words: [],
    score: 0,
    timer: 60,
    letters: '                ',
    isGameStarted: false,
    gameHasEnded: false
  }

  fetchLetters = () => {
    return fetch(BASE_URL + "/rounds/new")
      .then(res => res.json())
  }

  startGame = () => {
    this.fetchLetters()
      .then(json => this.setState({
        letters: json.setup,
        isGameStarted: true,
        gameHasEnded: false,
        timer: 60,
        words: [],
        score: 0
      }, () =>  {
        document.getElementById("poop").focus()
        this.createTimerInterval()
      }
    ))
  }

  endGame = () => {
    clearInterval(this.state.intervalId)
    this.setState({ isGameStarted: false, gameHasEnded: true })
  }

  submitScore = (event) => {
    const name = event.target.elements[0].value
    const data = {}
    data.score = this.state.score
    data.name = name
    this.postGameInfo(data)
  }

  postGameInfo = (data) => {
    fetch(BASE_URL + "/rounds", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  }


  createTimerInterval = () => {
     var intervalId = setInterval(this.timer, 1000);
     this.setState({intervalId: intervalId});
  }

  removeTimerInterval = () => {
    clearInterval(this.state.intervalId);
  }

  componentWillUnmount = () => {
     this.removeTimerInterval()
  }

  timer = () => {
    if (this.state.timer > 0) {
      this.setState({ timer: this.state.timer -1 });
    } else {
      this.endGame()
    }
  }

  handleWord = (word) => {
    if (!this.checkWordLength(word)) return false
    if (!this.checkDuplicateWord(word)) return false
    if (!this.checkWordExists(word)) return false
  }

  checkDuplicateWord = (word) => {
    return (this.state.words.includes(word) ? false : true)
  }

  checkWordLength = (word) => {
    return (word.length >= 3) ? true : false
  }

  checkWordExists = (word) => {
    fetch(BASE_URL + "/rounds/checkword", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "word": word})
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        json ? this.addWord(word) : false
      })
  }

  addWord = (word) => {
    const newWordArray = [word, ...this.state.words]
    const newScore = this.scoreWords(newWordArray)
    this.setState({words: newWordArray, score: newScore})
  }

  scoreWords  = (wordArray) => {
    return wordArray.reduce((score, currentWord) => {
      return score += (currentWord.length - 2)
    }, 0)
  }

  render() {
    return(
      <div>
        <div className="game-container-grid">
          {this.state.isGameStarted ? <Timer timer={this.props.timer} /> : null}
          <Board letters={this.state.letters} />
          <WordList words={this.state.words} />
          <Footer handleWord={this.handleWord} letters={this.state.letters} words={this.state.words} score={this.state.score} isGameStarted={this.state.isGameStarted}/>
          {this.state.isGameStarted ? null : <StartButton startGame={this.startGame}/>}
          {this.state.gameHasEnded ? <GameEndPopUp score={this.state.score} submitScore={this.submitScore}/> : null}
        </div>
      </div>
    )
  }
}

export default GameContainer
