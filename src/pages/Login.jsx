import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { useSupabase } from "../hook/useSupaBase";
import { useSession } from '../hook/useSession';


const Login = () => {
    const { supabase } = useSupabase();

    const { session, loading } = useSession();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [username, setUsername] = useState('')
    const [isSignup, setIsSignup] = useState(false)

    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault()

        if (isSignup) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) {
                console.error(error)
                alert(error.message)
            } else {
                console.log(data)
                const user = data.user

                if (user) {
                    await supabase
                        .from("profile")
                        .update({
                            display_name: displayName,
                            username: username,
                        })
                        .eq("id", user.id)
                }

                alert('Account created!')
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                alert(error.message)
            } else {
                navigate('/')
            }
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    // Logged in view
    if (session) {
        return (
            <div>
                <h1>Welcome!</h1>
                <p>Logged in as: {session.user.email}</p>
                <button onClick={handleLogout}>Sign Out</button>
            </div>
        )
    }

    // Auth form
    return (
        <div>
            <h1>{isSignup ? 'Sign Up' : 'Login'}</h1>

            <form onSubmit={handleAuth}>
                <section>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </section>
                {isSignup && (
                    <section>
                        <input
                            type="text"
                            placeholder="Display Name"
                            value={displayName}
                            required
                            onChange={(e) => setDisplayName(e.target.value)}
                        />

                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            required
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </section>
                )}

                <button disabled={loading}>
                    {loading
                        ? 'Loading...'
                        : isSignup
                            ? 'Create Account'
                            : 'Login'}
                </button>
            </form>

            <p style={{ marginTop: '10px' }}>
                {isSignup ? 'Already have an account?' : 'Don’t have an account?'}
                <button onClick={() => setIsSignup(!isSignup)}>
                    {isSignup ? 'Login' : 'Sign Up'}
                </button>
            </p>
        </div>
    )
}

export default Login;