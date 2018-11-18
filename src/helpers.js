const { promisify } = require("es6-promisify");
const parseString = require('xml2js').Parser({ explicitArray: false, async: true }).parseString;
const parseStringAsync = promisify(parseString);

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

function sortByLastWord(firstCat, secondCat) {
    const firstWord = firstCat[1].fact.split(" ").pop();
    const secondWord = secondCat[1].fact.split(" ").pop();
    return firstWord.localeCompare(secondWord);
}

module.exports = {
    parseXMLToJson,
    retrieveResponseData,
    processImages,
    processInfo,
    sortByLastWord
}