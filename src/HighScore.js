import React, {Component} from 'react'
import ScoreRow from './ScoreRow.js'

class HighScore extends Component {

  state = {
    scores: []
  }

  componentDidMount = () => {
    fetch("http://localhost:3000/rounds/highscores")
      .then(res => res.json())
      .then(highScores => {
        const renderedScores = this.createDivs(highScores)
        this.setState({scores: renderedScores})
      })
  }


  createDivs = (highScores) => {
    return highScores.map((round, idx) => {
      return <ScoreRow round={round} />
    })
  }


  render() {
    return (
      <ol className='highscore-ul'>
        {this.state.scores}
      </ol>
    )
  }
}

export default HighScore