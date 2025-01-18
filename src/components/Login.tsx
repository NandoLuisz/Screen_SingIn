import { SubmitHandler, useForm } from "react-hook-form"
import { userFecth } from "../axios/config"
import { z } from "zod"

const userLoginFormSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(20)
})

type LoginFormFields = z.infer<typeof userLoginFormSchema>

export const Login = () => {

  const 
    { register, 
      handleSubmit, 
      setError,
      formState: { errors, isSubmitting } 
    } = useForm<LoginFormFields>()
  
  const onSubmit: SubmitHandler<LoginFormFields> = async (data) => {
    const result  = userLoginFormSchema.safeParse(data)
    if(!result.success) return console.log("credenciais erradas")

    const { username, password } = data

    const user = {
      username,
      password
    }

    try {
      const response = await userFecth.post("/login", JSON.stringify(user))
      if(response.status === 200) return console.log(response.data)
    } catch (error: any) {
      if(error.response && error.response.status === 400){
        const errorMessage = error.response.data
        console.log(errorMessage)

        if(errorMessage === "Usuário não cadastrado."){
          setError("username", {
            message: errorMessage
          })
        }else if(errorMessage === "Senha incorreta."){
          setError("password", {
            message: errorMessage
          })
        }else{
          setError("root", {
            message: errorMessage
          })
        }
      }
    }
  }

  return (
    <div className="w-full h-screen bg-gray-400 flex justify-center items-center">
      <form 
        className="w-[400px] h-[500px] bg-white shadow-lg rounded px-6 py-6 flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl font-bold">Login</h1>
        <p>Digite seus dados abaixo</p>
        <div className="w-full flex flex-col gap-6">
          <div className="w-full flex flex-col gap-2">
              <span>Usuário</span>
              <input 
                {...register("username",
                  {required: "Usuário obrigatório"}
                )}
                type="text" 
                placeholder="Digite sua usuário" 
                className="py-2 px-2"
              />
              {errors.username && <span className="text-red-700">{errors.username.message}</span>}
          </div>
          <div className="w-full flex flex-col gap-2">
              <span>Senha</span>
              <input
                {...register("password", 
                  {required: "Senha é obrigatória"}
                )} 
                type="password" 
                placeholder="Digite sua senha" 
                className="py-2 px-2"
              />
              {errors.password && <span className="text-red-700">{errors.password.message}</span>}
          </div>
        </div>
        <a href="#">esqueci minha senha</a>
        <button 
          disabled={isSubmitting}
          type="submit" 
          className={`w-full ${isSubmitting ? "bg-red-500" : "bg-red-700"} rounded-sm py-2`}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
        {errors.root && <span className="text-red-700">{errors.root.message}</span>}
      </form>
    </div>
  )
}

