
import { createClient } from "@supabase/supabase-js";

export const useSupabase = () => {

    const supabase = createClient(
        'https://ytnidfgdppzywmhbuyyn.supabase.co',
        'sb_publishable_cIeC5DSC4oZZNFKcuMeAEg_V7iNodoi'
    );

    return {
        supabase: supabase
    }
};