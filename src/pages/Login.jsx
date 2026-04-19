import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useNavigate } from "react-router-dom"

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)

export default function App() {
    const [session, setSession] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignup, setIsSignup] = useState(false)
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        // Get current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (isSignup) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) {
                alert(error.message)
            } else {
                alert('Account created! You can now log in.')
                setIsSignup(false)
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

        setLoading(false)
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