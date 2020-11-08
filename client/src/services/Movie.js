import Api from '@/services/Api'
import _ from 'lodash'


export default{
        getMovies(id){
            return new Promise((resolve, rejects) =>{
                Api().get(`/home/?page=${id}`)
                .then((rows) =>{
                    resolve(rows.data)
                })
                .catch(err => rejects(err))
            })
        },

        getMovies_filtres(data){
            return new Promise((resolve, rejects) =>{
                Api().get(`/home/Library?search=${data}`)
                .then((rows) =>{
                    resolve(rows.data)
                })
                .catch(err => rejects(err))
            })
        },

        lastMovie(){
            return new Promise((resolve, rejects) => {
                Api().get('/home/lastadded')
                .then((rows)=>{
                    resolve(rows.data)
                })
                .catch(err => rejects(err))
            })
        },
        getMovieInfo(id){
            return new Promise((resolve, rejects) => {
                Api().get(`/home/movieInfo?id=${id}`)
                .then((rows)=>{
                    resolve(rows.data)
                })
                .catch(err => rejects(err))
            })
        },
        getSimilarMovie(id){
            return new Promise((resolve, reject) =>{
                Api().get(`/home/movieSimilar?id=${id}`)
                .then((rows)=>{
               
                    resolve(rows.data.results)
                })
                .catch(err => reject(err))
            })
        },
        MovieWatched(user_id){
            return new Promise((resolve, reject) =>{
                Api().get('/Home/watchlater', {"user_id": user_id})
                .then((r)=> resolve(r))
                .catch(err => reject(err))
            })
        },
        getSimilarMovieinfo(id){
            return new Promise((resolve, reject) =>{
                Api().get(`/Home/Similarinfo/${id}`)
                .then((rows)=> resolve(rows.data))
                .catch(err => reject(err))
            })
        },
        BoxOffice(page){
            return new Promise((resolve, rejects) =>{
                Api().get(`/home/Boxoffice/${page}`)
                .then((rows) =>{
                    resolve(rows.data.results)
                })
                .catch(err => rejects(err))
            })

        },
        UpComing(page){
            return new Promise((resolve, rejects) =>{
                Api().get(`/home/Upcoming/${page}`)
                .then((rows) =>{
                    resolve(rows.data.results)
                })
                .catch(err => rejects(err))
            })

        },
        getSub(id, lg){
            return new Promise((resolve, reject) =>{
                Api().post('/home/Sub',{"id": id, "lg": lg})
                .then((r)=> resolve(r))
                .catch(err => reject(err))
            })
        },
        filtre_search(sort, genre, page){
            return new Promise((resolve, reject) =>{
                Api().post('/home/Library',{"page": page, "genre": genre, "sort": sort})
                .then((r)=> resolve(r))
                .catch(err => reject(err))
            })
        },
        watchLater(id, poster, title, imdbid){
            return new Promise((resolve, reject) =>{
                Api().post('/Home/watchlater', {"user_id": id, "movieid": imdbid, "title": title, "poster": poster})
                .then((rows)=> resolve(rows.data))
                .catch(err => reject(err))
            })
        },
        addComment(comment, film){
            return new Promise((resolve, reject)=>{
                Api().post('/user/comment', {comment: comment, film: film})
                .then((resp)=>{
                })
                .catch(err => reject(err))
            })
        },
        getComments(id){
            return new Promise((resolve, reject)=>{
                Api().get(`/user/comments/${id}`)
                .then((comments)=>{
                    resolve(comments)
                })
                .catch(err => reject(err))
            })

        }
}