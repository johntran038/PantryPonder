import { useState, useEffect } from "react";
import { useSupabase } from "./useSupaBase";

export const useSession = () => {
    const { supabase } = useSupabase();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function getSession() {
            const { data: { session } } = await supabase.auth.getSession();
            if (isMounted) {
                setSession(session);
                setLoading(false);
            }
        }

        getSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [supabase]);

    return { session, loading };
}