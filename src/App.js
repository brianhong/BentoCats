import React, { Component } from 'react';
import './App.css';
import logo from "./logo.svg";
import Masonry from "react-masonry-css";
import { CORS_PROXY, IMAGES_SOURCE, INFO_SOURCE } from "./config";
import Card from "./Card";
import { processImages, processInfo, sortByLastWord } from "./helpers";

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

const Modal = ({ children }) => {
  return (
    <div style={modalContainer}>
      <section style={modalContent}>
        {children}
      </section>
    </div>
  )
}

const modalImageStyle = {
  height: "500px"
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
    this.toggleFavoriteFact = this.toggleFavoriteFact.bind(this);
    this.isFavorited = this.isFavorited.bind(this);
    this.isHovered = this.isHovered.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
    this.toggleFavoritesView = this.toggleFavoritesView.bind(this);
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

  sortCards(comparator = null) {
    const sortedCats = new Map([...this.state.cats.entries()].sort(comparator));
    const sortedOrder = [...sortedCats.keys()];

    this.setState({
      sorted: sortedOrder,
      showingSorted: !this.state.showingSorted
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

  toggleModal(id) {
    this.setState({
      showingModal: !this.state.showingModal,
      modalCardId: id
    })
  }

  render() {
    const { cats, favorited, sorted, showingFavorites, showingSorted, showingModal, modalCardId } = this.state;

    const renderCatsProp = [];
    let modalCard = null;
    const defaultCats = showingSorted ? new Map(sorted.map(id => [id, cats.get(id)])) : cats;

    !!defaultCats && defaultCats.forEach((cat, id, _) => {
      const catCard = (
        <Card
          key={id}
          id={id}
          toggleHover={id => this.toggleHover(id)}
          isHovered={this.isHovered(id)}
          isFavorited={this.isFavorited(id)}
          toggleFavoriteStatus={() => this.toggleFavoriteFact(id)}
          image={cat.imageUrl}
          fact={cat.fact}
          toggleModal={() => this.toggleModal(id)}
        />
      );

      if (showingModal && id === modalCardId) {
        modalCard = React.cloneElement(catCard, {
          customImageStyle: modalImageStyle
        })
      }

      if (showingFavorites) {
        favorited.includes(id) &&
          renderCatsProp.push(catCard);
      } else {
        renderCatsProp.push(catCard)
      }
    });

    return (
      <div className="App">
        {this.state.showingModal && !!modalCard && <Modal>{modalCard}</Modal>}
        {this.state.isLoaded ?
          <Test
            disabled={this.state.showingModal}
            cats={renderCatsProp}
            sortCards={this.sortCards}
            toggleFavoritesView={this.toggleFavoritesView}
            toggleSortedView={this.toggleSortedView}
            showingFavorites={showingFavorites}
            showingSorted={showingSorted}
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
    const { cats, sortCards, toggleFavoritesView, showingSorted, showingFavorites, disabled } = this.props;
    const breakpointColumns = {
      "default": 3,
      700: 2,
      500: 1
    };
    return (
      <div style={disabled ? { pointerEvents: "none" } : null}>
        <div style={controlsContainer} >
          <Button
            label={showingSorted ? "Revert" : "Sort"}
            clickHandler={() => sortCards(sortByLastWord)}
          />
          <Button
            label={showingFavorites ? "Show All" : "Favorites"}
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
