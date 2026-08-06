import { useContext } from "react"
import { ThemeDataContext } from "../context/ThemeContext"

const Navbar = () => {

    const [theme, setTheme] = useContext(ThemeDataContext)

  return (
    <div className='nav'>
      <h1>Navbar </h1>
      <h2>{theme}</h2>
      <button onClick={()=>{
        if(theme=="Light"){
            setTheme('Dark')
        }else{
            setTheme('Light')
        }
      }}>Change Theme</button>
    </div>
  )
}

export default Navbar
