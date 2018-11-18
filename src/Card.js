import React from 'react';

const imageStyle = {
    objectFit: "contain",
    paddingBottom: "20px",
    borderBottom: "1px solid black",
    height: "100%",
    width: "100%"
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
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    borderRadius: "5px"
}

const infoContainer = {
    padding: "20px 10px"
}

const Card = ({
    id,
    image,
    fact,
    isHovered,
    toggleHover,
    isFavorited,
    toggleFavoriteStatus,
    toggleModal,
    customImageStyle = {},
    inModal = false
}) => {
    return (
        <div
            onMouseEnter={() => !inModal && toggleHover(id)}
            onMouseLeave={() => !inModal && toggleHover(null)}
            onClick={toggleModal}
            style={isHovered ? hoveredCardStyle : cardStyle}
        >
            <img
                alt=""
                src={image}
                style={{ ...imageStyle, ...customImageStyle }}
            />

            <div style={infoContainer}>{fact}</div>

            <InputController
                inputLabel={"Favorite: "}
                checked={isFavorited}
                inputClickHandler={toggleFavoriteStatus}
            />
        </div>
    )
}


const InputController = ({ inputLabel, checked, inputClickHandler }) => {
    return (
        <form>
            <label>{inputLabel}</label>
            <input
                name="isFavorited"
                type="checkbox"
                checked={checked}
                onChange={inputClickHandler}
                onClick={e => e.stopPropagation()}
            />
        </form>
    );
}

export default Card; 
