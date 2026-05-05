import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { useSupabase } from "../hook/useSupabase";
import { useSession } from '../hook/useSession';


const Login = () => {
    const { supabase } = useSupabase();

    const { session, loading } = useSession();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [displayName, setDisplayName] = useState('')
    const [username, setUsername] = useState('')
    const [isSignup, setIsSignup] = useState(false)

    const [isUniqueUsername, setIsUniqueUsername] = useState(true)

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
                    const { error:publicProfileError } = await supabase
                        .from("public_profile")
                        .insert({
                            id: user.id,
                            display_name: displayName,
                            username: username,
                        })

                    if (publicProfileError) {
                        console.error(publicProfileError);
                        alert(publicProfileError.message);
                    }
                }

                alert('Account created!')
                // navigate('/')
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

    useEffect(()=>{
        
        const getData = async () => {
            const { data: existingUser, error: usernameCheckError } = await supabase
                .from("public_profile")
                .select("id")
                .eq("username", username)
                .maybeSingle();
            console.log(existingUser);
            
            setIsUniqueUsername(!(existingUser))
        }
        getData();
    },[username]);

    const handleLogout = async () => {
        await supabase.auth.signOut()
    }

    if (session) {
        return (
            <div className='h-screen bg-blue-200 p-4'>
                <h1>Welcome!</h1>
                <p>Logged in as: {session.user.email}</p>
                <button onClick={handleLogout}>Sign Out</button>
            </div>
        )
    }

    return (
        <div className='h-screen bg-blue-200 p-4'>
            <h1 className='text-2xl'>{isSignup ? 'Sign Up' : 'Login'}</h1>

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

                <button className='mt-3 bg-gray-200 p-1 rounded-lg outline-1 outline-gray-400 disabled:opacity-60 disabled:text-gray-600'
                    disabled={loading || !isUniqueUsername}
                >
                    {loading
                        ? 'Loading...'
                        : isSignup
                            ? 'Create Account'
                            : 'Login'}
                </button>
            </form>

            <p style={{ marginTop: '10px' }}>
                {isSignup ? 'Already have an account? ' : 'Don’t have an account? '}
                <button onClick={() => setIsSignup(!isSignup)}>
                    <div className='text-blue-700 hover:text-blue-500 underline'>{isSignup ? 'Login' : 'Sign Up'}</div>
                </button>
            </p>
        </div>
    )
}

export default Login;