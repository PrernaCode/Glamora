import { createClient } from "@supabase/supabase-js";   

const supabaseURL = "https://qydebixnsbfywbhhuqvd.supabase.co";
const  supabaseAnonKey = "sb_publishable_TqWPgfJq3N0gFBxUQ29wfw_Upa59O6X";

export const supabase = createClient(supabaseURL, supabaseAnonKey);
