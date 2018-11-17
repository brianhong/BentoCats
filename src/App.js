import React, { Component, PureComponent } from 'react';
import './App.css';
var parseString = require('xml2js').Parser({ explicitArray: false }).parseString;

const imagesLink = "https://cors-anywhere.herokuapp.com/http://thecatapi.com/api/images/get?format=xml&results_per_page=25";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      cats: [],
      favorites: []
    }
    this.toggleFavoriteFact = this.toggleFavoriteFact.bind(this);
  }

  componentDidMount() {
    window.fetch(imagesLink)
      .then(res => res.text())
      .then(
        (xmlString) => {
          parseString(xmlString, (err, { response }) => {
            if (err) {
              console.error("Uh oh!");
            }
            const imagesObject = response;
            const images = imagesObject.data.images.image;
            const initImages = images.map((image, index) => {
              return {
                id: index,
                imageSource: image.url
              }
            });
            this.setState({
              isLoaded: true,
              cats: initImages
            })
          });
        },
        (error) => {
          this.setState({
            error: true
          })
        }
      )
  }

  toggleFavoriteFact(factId) {
    const updatedFavoritesList = this.state.favorites.includes(factId) ?
      this.state.favorites.filter(favorited => favorited.id !== factId) :
      [...this.state.favorites, factId];

    this.setState((state, props) => {
      return {
        favorites: updatedFavoritesList
      }
    });
  }

  render() {
    const { cats } = this.state;
    return (
      <div className="App">
        {this.state.isLoaded ? <Test cats={cats} /> : <div>HelloWOrld</div>}
      </div>
    );
  }
}

class Test extends PureComponent {
  render() {
    const { cats } = this.props;
    return (
      cats.map(cat => {
        return (
          <div>
            <div>{cat.id + 1}</div>
            <img alt="" src={cat.imageSource}/>
          </div>
        )
      })
    );
  }
}

export default App;
