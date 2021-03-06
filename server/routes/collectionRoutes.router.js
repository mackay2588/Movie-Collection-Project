const express = require('express');
const router = express.Router();

console.log(' in collection router');

const pool = require('../modules/pool.js');

pool.on('connect', () => {
    console.log('postgresql connected');
});

pool.on('error', (error) => {
    console.log('Error connecting to db', error);
});

/* route to get movies from database
    send back array of movie objects as one argument
*/

router.get('/', (req, res) => {
    console.log('in get movies');

    const getMoviesQuery = `SELECT
		"movies"."title", 
		"movies"."rating", 
		"movies"."release_date",
		"movies"."run_time",
		"movies"."director",
		"movies"."writer",
		"movies"."actors",
		"movies"."plot",
		"movies"."image_url",
		"movies"."imdbRating",
		string_agg("name", ', ') 
		FROM "movies" JOIN "genre" ON "genre"."id" = CAST("movies"."genre_id" as INTEGER) 
		GROUP BY "movies"."title", 
		"movies"."rating", 
		"movies"."release_date",
		"movies"."run_time",
		"movies"."director",
		"movies"."writer",
		"movies"."actors",
		"movies"."plot",
		"movies"."image_url",
		"movies"."imdbRating";`;

    pool.query(getMoviesQuery)
        .then((results) => {
            console.log(results.rows);
            res.send(results.rows);
        })
        .catch((error) => {
            console.log('error getting movies:', error);
            res.sendStatus(500);
        });
}); //end get route to get movies

//DELETE 
/* route to remove movie from database */
router.delete('/:title/:plot', (req, res) => {
    console.log('in delete movie', req.params.title);

    let toDeleteTitle = req.params.title;
    let toDeletePlot = req.params.plot;
    
    const deleteMovieQuery = `DELETE FROM "movies" WHERE "title" = $1 AND "plot" = $2;`;

    pool.query(deleteMovieQuery, [toDeleteTitle, toDeletePlot])
        .then((results) => {
            console.log('movie deleted:', toDeleteTitle);
            res.sendStatus(201);
        })
        .catch((error) => {
            console.log('error deleting movie:', error);
            res.sendStatus(500);
        }); 
});//end delete route

module.exports = router;