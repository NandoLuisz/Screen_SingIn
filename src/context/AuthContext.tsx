import type React from "react";
import { createContext, useState, type ReactNode } from "react"
import { userFecth } from "../axios/config";
import { setCookie } from "nookies"
 
type SignInData = {
    username: string
    password: string
}

type User = {
    username: string
    email: string
}

type AuthContextType = { 
    isAuthenticated: boolean
    singIn: (data: SignInData, onSuccess: () => void) => Promise<void>
    user: User | null
}

export const AuthContext = createContext({} as AuthContextType)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    
    const [user, setUser] = useState<User | null>(null)

    const isAuthenticated = !!user

    async function singIn({ username, password }: SignInData, onSuccess: () => void) {

        const userRequest = {
            username,
            password
        }
        try {
            const response = await userFecth.post("/login", JSON.stringify(userRequest))
            if(response.status === 200) console.log(response.data)
            console.log(response.data)
            console.log(response.data.token)
            const token = response.data.token
            const username = response.data.username
            const email = response.data.email

            const user = {
                username,
                email
            }
            
            setCookie(undefined, 'screen-token', token, {
               maxAge: 60 * 60 * 1, // 1 hour                                                          
            })

            setUser(user)

            onSuccess();

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            singIn,
            user
        }}>
            {children}
        </AuthContext.Provider>
    )
}
