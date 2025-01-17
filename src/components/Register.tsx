import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { userFecth } from "../axios/config"
import { z } from "zod";

const userFormSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(20)
})

type FormFields = z.infer<typeof userFormSchema>

export const Register = () => {

  const 
    { register, 
      handleSubmit, 
      setError,
      formState: { errors, isSubmitting },
    } = useForm<FormFields>({
      defaultValues: {
        email: "teste@email.com"
      }
    })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const result = userFormSchema.safeParse(data) 
    if(!result.success) return 

    const { username, email, password } = data
    const role  = "ADMIN"
    const user = {
      username,
      password,
      email,
      role
    }

    try {
      const response = await userFecth.post("/register", JSON.stringify(user))
      if(response.status === 200) console.log("Usuário cadastrado com sucesso!")
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data
        console.error(errorMessage)
        
        if (errorMessage === "Usuário já cadastrado.") {
          setError("username", { message: errorMessage });
        } else if (errorMessage === "Email já cadastrado.") {
          setError("email", { message: errorMessage });
        } else {
          setError("root", { message: "Erro inesperado ao registrar o usuário." });
        }

      } else {
        console.error("Erro desconhecido:", error);
        setError("root", { message: "Erro de conexão com o servidor." });
      }
    }
  }

  return (
    <div className="w-full h-screen bg-gray-400 flex justify-center items-center">
      <form 
        className="w-[400px] min-h-[500px] bg-white shadow-lg rounded px-6 py-6 flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl font-bold">Register</h1>
        <p>Digite seus dados abaixo</p>
        <div className="w-full flex flex-col gap-6">
          <div className="`w-full flex flex-col gap-2">
              <span>Usuário</span>
              <input 
                {...register("username", 
                  {required: "Usuário obrigatório", 
                                               minLength: {
                                                value: 3,
                                                message: "Usuário precisa ter no mínimo 6 caracteres"
                                               }
                                              })} 
                type="text" 
                placeholder="Digite seu usuário" 
                className="py-2 px-2"
              />
              {errors.username && <span className="text-red-500">{errors.username.message}</span>}
          </div>
          <div className="w-full flex flex-col gap-2">
              <span>Email</span>
              <input 
                {...register("email", 
                  {required: "Email obrigatório!", 
                                            validate: (value) => {
                                              if(!value.includes("@")){
                                                return "Email precisa ser válido"
                                              } 
                                              return true
                                            },})} 
                type="email" 
                placeholder="Digite seu email" 
                className="py-2 px-2"
              />
              {errors.email && <span className="text-red-500">{errors.email.message}</span>}
          </div>
          <div className="w-full flex flex-col gap-2">
              <span>Senha</span>
              <input 
                {...register("password", 
                  {required: "Senha obrigatória", 
                                               minLength: {
                                                value: 6,
                                                message: "Senha ter no minímo 6 digitos"
                                               },
                                              })} 
                type="password" 
                placeholder="Digite sua senha" 
                className="py-2 px-2"
              />
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
          </div>
        </div>
        <button 
          disabled={isSubmitting} type="submit" 
          className={`w-full ${isSubmitting ? "bg-red-500" : "bg-red-700"} rounded-sm py-2`}>
            {isSubmitting ? "Cadastrando..." : "Criar"}
        </button>
        {errors.root && <span className="text-red-500">{errors.root.message}</span> }
      </form>
    </div>
  )
}

