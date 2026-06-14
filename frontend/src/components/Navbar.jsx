import { useNavigate } from "react-router-dom"
import auth from "../config"
import { signOut } from "firebase/auth"
function Navbar() {
    const navigate = useNavigate()
    function handleSignOut() {
        signOut(auth).then(function () {
            navigate("/login")
        }).catch(function (error) {
            console.log(error)
        })
    }
    function handleHome(){
        navigate("/home")
    }
    function handleChat(){
        navigate("/chat")
    }

    return (
        <nav className="flex justify-between p-5 bg-blue-950 text-white shadow-xl">
            <div>
                <h1 className="text-2xl font-bold">Swasthy Voice</h1>
            </div>
            <div className="flex gap-3 items-center">
                <h2 className="hover:cursor-pointer hover:underline" onClick={handleHome}>Home</h2>
                <h2 className="hover:cursor-pointer hover:underline" onClick={handleChat}>HealthAI</h2>
                <h3 className="hover:cursor-pointer hover:underline" onClick={handleSignOut}>LogOut</h3>
            </div>
        </nav>
    )
}
export default Navbar