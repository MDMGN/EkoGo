import { cardOption } from "./CardOption";
import { SearchForm } from "./SearchForm";
import api from "../helpers/api";
import { ajax } from "../helpers/ajax";
import { SearchCard } from "./SearchCard";
import { Event } from "./Event";
export async function Router(){
    const $app=document.getElementById("app");
    const $options=document.createElement("div")
    $options.className='options'
    $options.innerHTML=null
    $app.innerHTML=null;
    let {hash}=location;
    
    if(!hash || hash==="#/"){
        const search_event={
            endpoint:'search',
            title:'Buscar experiencias',
            title_eus:'Esperientzia sortu'
        }, create_event={
            endpoint:'create',
            title:'Crear experiencias',
            title_eus:'Esperientzia bilatu'
        }
        
        $options.appendChild(cardOption(search_event))
        $options.appendChild(cardOption(create_event))
        $app.appendChild($options)
    }else if(hash.includes('#/search')){
        $app.appendChild(SearchForm())
        let query=localStorage.getItem("apiSearch");
        if(!query){
            /* document.querySelector(".loader").style.display="none"; */
            return false
        };
        await ajax({
            url:`${api.EVENTS+`${query}`+api.TYPES}`,
            cbSuccess: types=>{
                let html="";
                if(types.items.length===0){
                    html=`
                    <p class="error">
                        No existen resultados de búsqueda para el término
                        <mark>${query}</mark>
                    </p>
                    `;
                }else{
                    console.log(types.items.id);
                    types.items.forEach((item) =>{
                        if(item.establishmentEu)  html+=SearchCard(item);
                    });
                 }
                document.getElementById("app").innerHTML+=html;
            }
        });
    }else{
        $app.innerHTML=null
        let query=''
        await ajax({
            url:`https://api.euskadi.eus/culture/events/v1.0/events?_elements=20&_page=1`,
            cbSuccess:(types)=>{
                if(types.items.length===0){
                    html=`
                    <p class="error">
                        No existen resultados de búsqueda para el término
                        <mark>${query}</mark>
                    </p>
                    `;
                }else{
                    types.items.forEach((item) =>{
                         $app.appendChild(Event(item));
                    });
                 }
                
            }
        })
    }
}