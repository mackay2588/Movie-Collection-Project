movieApp.controller('SearchController', ['$http', function($http){
    console.log('in SearchController');

    const self = this;

    self.hideWarning = true;

    //GET
    self.searchMovies = function(searchTerms){
        console.log('in searchMovies');

        let term = searchTerms.term;
        let type = searchTerms.type;

        console.log('searchTerms', searchTerms);

        $http({
            method: 'GET',
            url: '/search/' + term + '/' + type
        })
        .then(function(response){
            console.log('movies:', response.data);
            console.log(response.data.length);

            if(response.data.length == 0){
                self.hideWarning = false;
            }
            else if(response.data.length > 0){
                self.hideWarning = true;
            }

            self.searchArr = [];
            for (let movie of response.data) {
                let thisMovieObj = {
                    id: movie.string_agg,
                    title: movie.title,
                    rating: movie.rating,
                    genre: movie.string_agg,
                    release_date: movie.release_date,
                    run_time: movie.run_time,
                    director: movie.director,
                    writer: movie.writer,
                    actors: movie.actors,
                    plot: movie.plot,
                    imdbRating: movie.imdbRating,
                    image_url: movie.image_url,
                    isHidden: true
                };

                console.log('all movies');
                self.searchArr.push(thisMovieObj);
            }

            self.searchTerms = {};

        })
        .catch(function(error){
            self.searchTerms = {};
            console.log('error searching:', error);
        });
    }//end searchMovies



}]);//end SearchController