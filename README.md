## Fairy Chess
This is a web page for playing fairy chess, which is chess with different 
rules or pieces!

### Resources
A list of different pieces to add can be [found here.](https://www.chessvariants.com/graphics.dir/cazaux/catalog.html)

Piece images are from [greenchess.net](https://greenchess.net/info.php?item=downloads)

Most of the timer code was written by [Tapas Adhikary](https://www.tapasadhikary.com/)

To run locally:
* Navigate to the server directory, then run `uvicorn main:app --reload`
* From the root dir, run `npx next dev`

### Todo
Move board request logic to Game component, and pass request params from index.js