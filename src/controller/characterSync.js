// Por questões didáticas abaixo estarão alguns comentários explicando o que cada função faz.

class characterSync{
    constructor(){
        this.request = new XMLHttpRequest();
        this.endpoint = "https://rickandmortyapi.com/api/character/";
        this.container = document.querySelector('.container');
        this.searchResult;
        this.recoverCharacters(this.request,this.endpoint);
        this.limiterCount = 0;
    }
    /**
    *    Função responsável por recuperar da API todos os characters e envia-lo para construçào 
    */ 
    async recoverCharacters(request,endpoint) {
        request.open('GET', endpoint,true);
        await request.send()
        request.onreadystatechange  = () =>{
            if (this.request.readyState == 4){
                /*  ****************************** NOTA *********************************
                *   Neste caso adicionei a response também em uma variável local para que 
                *   não fosse necessário ficar executando a ação sempre.JSON
                */
                this.searchResult = JSON.parse(this.request.response)
                return this.constructCharacters(JSON.parse(this.request.response))
            }
        }
    }
    /**
     *  Responsável pela Paginação dos personagens, desde a criação dos botões à inserção de funcionalidade 
     * em cada um deles
     */
    pagination(lista, selected = 1){
        let quantidade = lista.length / 3;
        let pagin = "";
        let pagination = document.createElement('div');
        for(let i = 0; i < quantidade ; i++) {
            pagin += `     <div class="pages">
              <button class="button but${i}">${i + 1}</button>
             </div>  `;
        }
        pagination.innerHTML = pagin;
        this.container.appendChild(pagination);
        document.querySelectorAll('.button').forEach(selected =>{
            selected.addEventListener('click', event=>{
                this.constructCharacters(this.searchResult,parseFloat(event.target.innerHTML))
            })
        });
        document.querySelector(`.but${selected-1}`).className += " select";

    }

    /**
     * Aqui será criada a limitação dos meus cards(onde direi que quero apenas 3 personagens por vez)
     * e onde limitárei o resultado obtido na requisiçào feita em recoverCharacters(request,endpoint) 
     */
    characterLimit(list,page = 1){
        let selectedPage = page;
        page = ( page * 3) - 3;
        let filteredList = list.filter((list,index) =>{
            return index >= page && index <= page+2
        });
        this.pagination(list,selectedPage);
        return filteredList;
    }

    /**
     * Por fim mas não menos importante, aqui serão criados e adicionados todos os Personagens 
     */
    constructCharacters(response,page = 1){
       let characterRows =  document.createElement('div');
       this.container.innerHTML = "";
       let data = this.characterLimit(response.results,page);
       characterRows.innerHTML = data.map(result =>{
         return `<div class="space">
                     <div class="character">
                        <img class="image" src="${result.image}">
                        <span class="character_id">${result.id}</span>
                        <span class="character_name">${result.name}</span>
                        <span class="species">${result.species}</span>
                    </div>
                </div>`
        }).join("");
        this.container.appendChild(characterRows)
    }


}


