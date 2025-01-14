import { useState } from "react"

import { userFecth } from "../axios/config"

export const Register = () => {

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
 
  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const registerUser = async () => {
    const role  = "ADMIN"
    const user = {
      username,
      password,
      role
    }
    console.log(user)
    const userJSON = JSON.stringify(user)
    try {
      const response = await userFecth.post("/register", userJSON)
      if(response.status === 200) console.log("Deu certo")
    } catch (error) {
        console.log(error)
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    registerUser()
  }


  return (
    <div className="w-full h-screen bg-gray-400 flex justify-center items-center">
      <form className="w-[400px] h-[500px] bg-white shadow-lg rounded px-6 py-6 flex flex-col gap-6"
      onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold">Register</h1>
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
        <button type="submit" className="w-full bg-red-700 rounded-sm py-2">
          Criar
        </button>
      </form>
    </div>
  )
}

