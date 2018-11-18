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
    image,
    fact,
    isHovered,
    id,
    toggleHover,
    isFavorited,
    toggleFavoriteStatus,
    toggleModal,
    customImageStyle = {}
}) => {
    return (
        <div
            onMouseEnter={() => toggleHover(id)}
            onMouseLeave={() => toggleHover(null)}
            onClick={toggleModal}
            style={isHovered ? hoveredCardStyle : cardStyle}
        >
            <img
                alt=""
                src={image}
                style={{...imageStyle, ...customImageStyle}}
            />

            <div style={infoContainer}>
                {fact}
            </div>

            <form>
                <label>
                    {"Favorite"}
                    <input
                        name="isFavorited"
                        type="checkbox"
                        checked={isFavorited}
                        onChange={e => {
                            e.stopPropagation();
                            toggleFavoriteStatus();
                        }}
                    />
                </label>
            </form>
        </div >
    )
}

export default Card;