import React from "react";
import Masonry from "react-masonry-css";
import { sortByLastWord } from "./helpers";

const breakpointColumns = {
    "default": 3,
    700: 2,
    500: 1
};

const controlsContainer = {
    paddingBottom: "10px"
}

function Button({ label, clickHandler }) {
    return (
        <button type="button" onClick={clickHandler}>
            {label}
        </button>
    );
}

const CardBoard = ({
    cats, sortCards, toggleFavoritesView, showingSorted, showingFavorites, disabled, hasFavorites
}) => {
    return (
        <div style={disabled ? { pointerEvents: "none" } : null}>
            <div style={controlsContainer} >
                <Button
                    label={showingSorted ? "Revert" : "Sort"}
                    clickHandler={() => sortCards(sortByLastWord)}
                />
                {
                    hasFavorites &&
                    <Button
                        label={showingFavorites ? "Show All" : "Favorites"}
                        clickHandler={() => toggleFavoritesView()}
                    />
                }
            </div>
            <Masonry breakpointCols={breakpointColumns}>
                {cats}
            </Masonry>
        </div>
    );
}

export default CardBoard;