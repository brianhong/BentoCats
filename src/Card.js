import React, { Component, PureComponent } from 'react';

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
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    borderRadius: "5px"
}

const infoContainer = {
    padding: "20px 10px"
}

export default class Card extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isHovered: false
        }
    }
    render() {
        const { image, fact, isHovered, id, toggleHover, isFavorited, toggleFavoriteStatus } = this.props;
        return (
            <div
                onMouseEnter={() => toggleHover(id)}
                onMouseLeave={() => toggleHover(null)}
                onClick={() => console.log("This is when I'd open a modal with this card")}
                style={isHovered ? hoveredCardStyle : cardStyle}
            >
                <img
                    alt=""
                    src={image}
                    style={imageStyle}
                />

                <div style={infoContainer}>
                    {fact}
                </div>

                <form>
                    <label>
                        Favorite
                        <input
                            name="isFavorited"
                            type="checkbox"
                            checked={isFavorited}
                            onChange={toggleFavoriteStatus}
                        />
                    </label>
                </form>
            </div >
        )
    }
}