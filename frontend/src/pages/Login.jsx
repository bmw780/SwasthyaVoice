import { useEffect, useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import auth from "../config"
import { useNavigate } from "react-router-dom"
function Login() {
    const [email,setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    function handleEmail(evt){
        setEmail(evt.target.value)
    }
    function handlePass(evt){
        setPassword(evt.target.value)
    }
    function handleSubmit(){
        signInWithEmailAndPassword(auth, email, password).then(()=>{
            console.log("User logged In")
            navigate("/home")
        }).catch(()=>{
            console.log("User not logged")
        })
    }
    function handleSignIn(){
        navigate("/signup")
    }
    useEffect(()=>{
        auth.onAuthStateChanged(function(user){
            if(user){
                navigate("home")
            } else{
               console("user not logged in")
            }
        })
    })

    return (
        <div className="flex bg-blue-950 justify-center items-center p-10 h-screen relative">
            <h1 className="text-white font-bold text-3xl absolute left-5 top-5">Swasthy Voice</h1>
            <div className="flex flex-col bg-white py-10 px-8 rounded-2xl ">
                <h1 className="mb-5 text-2xl font-bold">Login </h1>
                <input type="text" className="outline-none border border-gray-500 p-2 m-2 w-70" placeholder="Enter email here..." value={email} onChange={handleEmail}/>
                <input type="password" className="outline-none border border-gray-500 p-2 m-2 w-70" placeholder="Enter password..." value={password} onChange={handlePass} />
                <button className="bg-blue-400 border-blue-500 rounded-2xl self-start p-2 m-2 cursor-pointer" onClick={handleSubmit}>Log In</button>
                <p className="text-gray-400 underline cursor-pointer" onClick={handleSignIn}>Don't Have an Account, SignUp Here!</p>
            </div>
        </div>
    )
}
export default Login