import { useState } from "react"

import { userFecth } from "../axios/config"

export const Login = () => {

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
 
  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const loginUser = async () => {
    const user = {
      username,
      password
    }
    console.log(user)
    const userJSON = JSON.stringify(user)
    try {
      const response = await userFecth.post("/login", userJSON)
      if(response.status === 200){
        console.log("Login feito com sucesso!")
        console.log(response.data)
      }
    } catch (error) {
        console.log(error)
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    loginUser()
  }


  return (
    <div className="w-full h-screen bg-gray-400 flex justify-center items-center">
      <form className="w-[400px] h-[500px] bg-white shadow-lg rounded px-6 py-6 flex flex-col gap-6"
      onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold">Login</h1>
        <p>Digite seus dados abaixo</p>
        <div className="w-full flex flex-col gap-6">
          <div className="w-full flex flex-col gap-2">
              <span>Usuário</span>
              <input type="text" placeholder="Digite sua usuário" className="py-2 px-2"
              onChange={handleChangeUsername}/>
          </div>
          <div className="w-full flex flex-col gap-2">
              <span>Senha</span>
              <input type="text" placeholder="Digite sua senha" className="py-2 px-2"
              onChange={handleChangePassword}/>
          </div>
        </div>
        <a href="#">esqueci minha senha</a>
        <button type="submit" className="w-full bg-red-700 rounded-sm py-2">
          Entrar
        </button>
      </form>
    </div>
  )
}

