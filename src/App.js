import React, { Component } from 'react';
import './App.css';
import logo from "./logo.svg";
import Masonry from "react-masonry-css";
import { CORS_PROXY, IMAGES_SOURCE, INFO_SOURCE } from "./config";
import Card from "./Card";
import { processImages, processInfo, sortByLastWord } from "./helpers";

const imageSource = CORS_PROXY + IMAGES_SOURCE;
const infoSource = CORS_PROXY + INFO_SOURCE;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      cats: null,
      toggledCard: null,
      favorited: [],
      showingFavorites: false
    }

    this.sortCards = this.sortCards.bind(this);
    this.toggleFavoriteFact = this.toggleFavoriteFact.bind(this);
    this.isFavorited = this.isFavorited.bind(this);
    this.isHovered = this.isHovered.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
    this.toggleFavoritesView = this.toggleFavoritesView.bind(this);
  }

  componentDidMount() {
    const dataProcessingMap = {
      images: imageSource,
      info: infoSource
    };

    const iterableDataFetches = Object.entries(dataProcessingMap).map(source => {
      const dataSourceType = source[0];
      const dataSource = source[1];

      switch (dataSourceType) {
        case "images": return processImages(dataSource);
        case "info": return processInfo(dataSource);
        default: return null;
      }
    });

    Promise
      .all(iterableDataFetches)
      .then(responses => {
        const catImages = responses[0];
        const catInfos = responses[1];

        const initCats = catImages.map((image, index) => {
          return [
            index,
            {
              ...image,
              ...catInfos[index]
            }]
        });

        this.setState({
          isLoaded: true,
          cats: new Map(initCats)
        });
      });
  }

  sortCards(comparator = null) {
    const sortedCats = new Map([...this.state.cats.entries()].sort(comparator));
    this.setState({
      cats: sortedCats
    });
  }

  toggleFavoriteFact(id) {
    const { favorited } = this.state;

    const updatedFavorites = favorited.includes(id) ?
      favorited.filter(favoriteId => favoriteId !== id) :
      [...favorited, id];

    this.setState({
      favorited: updatedFavorites
    });
  }

  isFavorited(id) {
    return this.state.favorited.includes(id);
  }

  toggleHover(cardId = null) {
    this.setState({
      toggledCard: cardId
    })
  }

  isHovered(id) {
    return this.state.toggledCard === null ?
      true :
      id === this.state.toggledCard
  }

  toggleFavoritesView() {
    this.setState({
      showingFavorites: !this.state.showingFavorites
    });
  }

  render() {
    const { cats, favorited, showingFavorites } = this.state;

    const renderCatsProp = [];
    
    !!cats && cats.forEach((cat, id, _) => {
      console.log(id, favorited.includes(id));
      if (showingFavorites) {
        favorited.includes(id) && renderCatsProp.push(
          <Card
            key={id}
            id={id}
            toggleHover={id => this.toggleHover(id)}
            isHovered={this.isHovered(id)}
            isFavorited={this.isFavorited(id)}
            toggleFavoriteStatus={() => this.toggleFavoriteFact(id)}
            image={cat.imageUrl}
            fact={cat.fact}
          />)
      } else {
        renderCatsProp.push(
          <Card
            key={id}
            id={id}
            toggleHover={id => this.toggleHover(id)}
            isHovered={this.isHovered(id)}
            isFavorited={this.isFavorited(id)}
            toggleFavoriteStatus={() => this.toggleFavoriteFact(id)}
            image={cat.imageUrl}
            fact={cat.fact}
          />)
      }
    });

    return (
      <div className="App">
        {this.state.isLoaded ?
          <Test
            cats={renderCatsProp}
            sortCards={this.sortCards}
            toggleFavoritesView={this.toggleFavoritesView}
          /> :
          <img className={"App-logo"} alt="" src={logo} />
        }
      </div>
    );
  }
}

function Button({ label, clickHandler }) {
  return (
    <button type="button" onClick={clickHandler}>
      {label}
    </button>
  );
}

const controlsContainer = {
  paddingBottom: "10px"
}

class Test extends Component {
  render() {
    const { cats, sortCards, toggleFavoritesView } = this.props;
    const breakpointColumns = {
      "default": 3,
      700: 2,
      500: 1
    };
    return (
      <div>
        <div style={controlsContainer} >
          <Button
            label="Sort"
            clickHandler={() => sortCards(sortByLastWord)}
          />
          <Button
            label="Favorites"
            clickHandler={() => toggleFavoritesView()}
          />
        </div>
        <Masonry breakpointCols={breakpointColumns}>
          {cats}
        </Masonry>
      </div>
    );
  }
}

export default App;
