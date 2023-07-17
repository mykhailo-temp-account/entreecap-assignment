import {onMount} from "solid-js";

import("../index.css")
import {createStore, produce} from "solid-js/store";
import {For} from "solid-js/web";

export const documentProps = {
  title: "Entree Home Assignment"
}

const [characters, setCharacters] = createStore([])


async function searchData(text) {
  let url = "http://localhost:4000/private/api/v1/search"
  if (text && text.length > 1) {
    url = `${url}?query=${text.trim()}`
  }
  let result = await fetch(url).then(r => r.json())

  setCharacters(result)
}

const Header = () => {

  return <header className="bg-light p-4">
    <div className="container">
      <div className="row">
        <div className="col-6 offset-3">
          <form className="input-group" action="#" method="GET">
            <input type="text" className="form-control" placeholder="Search..."
                   onInput={(e) => searchData(e.target.value)} />
          </form>
        </div>
      </div>
    </div>
  </header>
}

const todo = "https://via.placeholder.com/150"

const Card = (props) => {
  return <div className="card">
    <img src={props.imageUrl ?? "https://via.placeholder.com/1080x720"} className="card-img-top" alt="Card Image" />
    <div className="card-body">
      <h5 className="card-title">{props.name}</h5>
      <h6 className="card-title">Played by {props.actor}</h6>
      <p className="card-text">{props.description}</p>
    </div>
  </div>
}

const Page = () => {

  onMount(async () => {
    await searchData(null)
  })

  return <>
    <Header />
    <section className="py-4">
      <div className="container">
        <div className="card-container">
          <For each={characters}>{c =>
            <Card name={c.name} actor={c.actor} description={c.description} imageUrl={c.imageUrl}/>
          }</For>
        </div>
      </div>
    </section>
  </>
}

export {Page}