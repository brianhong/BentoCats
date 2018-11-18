import React, { Component } from 'react';

import './App.css';
import logo from "./logo.svg";
import Card from "./Card";
import CardBoard from "./CardBoard";

import { CORS_PROXY, IMAGES_SOURCE, INFO_SOURCE } from "./config";
import { processImages, processInfo } from "./helpers";

const imageSource = CORS_PROXY + IMAGES_SOURCE;
const infoSource = CORS_PROXY + INFO_SOURCE;

const modalContainer = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.6)",
  display: "inline-block",
  pointerEvents: "auto"
}

const modalContent = {
  position: "fixed",
  background: "white",
  width: "80%",
  height: "auto",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)"
};

const modalImageStyle = {
  height: "500px"
}

const Modal = ({ children }) => {
  return (
    <div style={modalContainer}>
      <section style={modalContent}>
        {children}
      </section>
    </div>
  )
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      cats: null,
      toggledCard: null,
      favorited: [],
      sorted: [],
      showingFavorites: false,
      showingSorted: false,
      showingModal: false,
      modalCardId: null
    }

    this.sortCards = this.sortCards.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
    this.isHovered = this.isHovered.bind(this);
    this.toggleFavoritesView = this.toggleFavoritesView.bind(this);
    this.toggleFavoriteFact = this.toggleFavoriteFact.bind(this);
    this.isFavorited = this.isFavorited.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
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
            }
          ]
        });

        this.setState({
          isLoaded: true,
          cats: new Map(initCats)
        });
      });
  }

  sortCards(comparator = () => {}) {
    const sortedCats = new Map([...this.state.cats.entries()].sort(comparator));
    const sortedOrder = [...sortedCats.keys()];

    this.setState({
      sorted: sortedOrder,
      showingSorted: !this.state.showingSorted
    });
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

  toggleModal(id) {
    this.setState({
      showingModal: !this.state.showingModal,
      modalCardId: !this.state.showingModal ? id : null
    })
  }

  render() {
    const { 
      cats, favorited, sorted, showingFavorites, showingSorted, showingModal, modalCardId 
    } = this.state;

    let modalCard = null;
    const renderCatsProp = [];

    const allTheCats = showingSorted ? new Map(sorted.map(id => [id, cats.get(id)])) : cats;

    !!allTheCats && allTheCats.forEach((cat, id) => {
      const catCard = (
        <Card
          key={id}
          id={id}
          image={cat.imageUrl}
          fact={cat.fact}
          isHovered={this.isHovered(id)}
          toggleHover={id => this.toggleHover(id)}
          isFavorited={this.isFavorited(id)}
          toggleFavoriteStatus={() => this.toggleFavoriteFact(id)}
          toggleModal={() => this.toggleModal(id)}
        />
      );

      if (showingModal && id === modalCardId) {
        modalCard = React.cloneElement(catCard, {
          customImageStyle: modalImageStyle,
          inModal: true
        })
      }

      showingFavorites ?
        favorited.includes(id) && renderCatsProp.push(catCard) :
        renderCatsProp.push(catCard)
    });

    return (
      <div className="App">
        {
          this.state.showingModal && 
          !!modalCard && 
          <Modal>{modalCard}</Modal>
        }
        {this.state.isLoaded ?
          <CardBoard
            disabled={this.state.showingModal}
            cats={renderCatsProp}
            sortCards={this.sortCards}
            toggleFavoritesView={this.toggleFavoritesView}
            toggleSortedView={this.toggleSortedView}
            showingFavorites={showingFavorites}
            showingSorted={showingSorted}
            hasFavorites={favorited.length > 0}
          /> :
          <img className={"App-logo"} alt="" src={logo} />
        }
      </div>
    );
  }
}

export default App;
