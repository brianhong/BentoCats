import React, { Component, PureComponent } from 'react';
import './App.css';

import Masonry from "react-masonry-css";
import { CORS_PROXY, IMAGES_SOURCE, INFO_SOURCE } from "./config";

const { promisify } = require("es6-promisify");
const parseString = require('xml2js').Parser({ explicitArray: false, async: true }).parseString;
const parseStringAsync = promisify(parseString);

const imageSource = CORS_PROXY + IMAGES_SOURCE;
const infoSource = CORS_PROXY + INFO_SOURCE;


function parseXMLToJson(xmlString) {
  return parseStringAsync(xmlString)
    .then(({ response }) => {
      const imageUrls = response.data.images.image;
      return imageUrls.map(image => image.url);
    })
    .catch(err => console.error(err));
}

function retrieveResponseData(fetchResponse) {
  const contentType = fetchResponse.headers.get("content-type");
  switch (contentType) {
    case "application/xml": return fetchResponse.text();
    case "application/json": return fetchResponse.json();
    default: return null;
  }
}

function processImages(imageSourceUrl) {
  return window
    .fetch(imageSourceUrl)
    .then(response => retrieveResponseData(response))
    .then(parseXMLToJson)
    .then(imageData => imageData.map(url => {
      return { imageUrl: url }
    }))
    .catch(err => console.error(err))
}

function processInfo(infoSourceUrl) {
  return window
    .fetch(infoSourceUrl)
    .then(response => retrieveResponseData(response))
    .then(infoData => infoData.data.map(info => info))
    .catch(err => console.error(err))
}

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
          return {
            ...image,
            ...catInfos[index]
          }
        });

        this.setState({
          isLoaded: true,
          cats: initCats
        });
      });
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
  constructor(props) {
    super(props);
    this.toggleHover = this.toggleHover.bind(this);
    this.state = {
      toggledCard: null
    }
  }

  toggleHover(cardId) {
    this.setState({
      toggledCard: cardId
    })
  }

  render() {
    const { cats } = this.props;
    const breakpointColumns = {
      "default": 3,
      700: 2,
      500: 1
    };
    return (
      <Masonry breakpointCols={breakpointColumns}>
        {
          cats.map((cat, index) => {
            return (
              <Card
                key={index}
                id={index}
                toggleHover={(id) => this.toggleHover(id)}
                isHovered={
                  this.state.toggledCard === null ? 
                    true : 
                    index === this.state.toggledCard
                }
                image={cat.imageUrl}
                fact={cat.fact}
              />
            )
          })
        }
      </Masonry>
    );
  }
}

const imageStyle = {
  objectFit: "contain",
  paddingBottom: "20px",
  borderBottom: "1px solid black",
}

const cardStyle = {
  display: "flex",
  flexDirection: "column",
  alignContent: "center",
  justifyContent: "center",
  opacity: "0.5",
  padding: "10px"
}

const hoveredCardStyle = {
  ...cardStyle,
  opacity: "1",
  boxShadow: "0px 2px grey",
  borderRadius: "5px"
}

const infoContainer = {
  padding: "20px 10px"
}

class Card extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false
    }
  }
  render() {
    const { image, fact, isHovered, id, toggleHover } = this.props;
    return (
      <div
        onMouseEnter={() => toggleHover(id)}
        onMouseLeave={() => toggleHover(null)}
        style={isHovered ? hoveredCardStyle : cardStyle}
      >
        <img
          alt=""
          src={image}
          style={imageStyle} />
        <div style={infoContainer}>{fact}</div>
      </div >
    )
  }
}

export default App;
