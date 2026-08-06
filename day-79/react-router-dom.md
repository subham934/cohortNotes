React-Router-dom

install react router dom "npm i react-router-dom"

in main.jsx "import {BrowserRouter} from 'react-router-dom'"

wrap by BrowserRouter in main.jsx file

In App.jsx "import { Route, Routes } from 'react-router-dom'"

make (collection of all route) and inside make

In mention path (where to go) and elements (what to render) attributes

In Navbar Use by 'react-router-dom' tag to redirect to any specific route

Make Navbar Component as well and add it before in App.jsx

Nestes Routes can be made by writing in this way - path="/product/men"

Dynamic Routes can be made by writing this way - path="/product/:id"

You can access id by using useParams() hook inside that component you rendered in a Dynamic Route