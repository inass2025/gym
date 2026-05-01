
import Navbar from './navbar';
import { Outlet } from 'react-router-dom';
import "./layout.css"
export default function Layout({children}){

return(
    <>
    <div className="layout">
      <Navbar />
      <main className="layout__outlet" >
        <Outlet />
      </main>
      
     
    </div>
  
    </>
)
}