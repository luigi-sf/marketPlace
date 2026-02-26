const tokenKey = 'marketToken'

export const tokenService = {
    get(){
        return localStorage.getItem(tokenKey)
    },

    set(token:string){
        localStorage.setItem(tokenKey,token) /*setando o tokenKey com o valor do token*/
    },

    remove(){
        localStorage.removeItem(tokenKey)
    }
}