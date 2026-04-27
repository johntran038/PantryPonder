
    const profile_data = [
        ["Jane Smith", "janesmith@gmail.com", "janesmith", "janesmithpassword"] ,
        ["Michael Brown", "michaelbrown@gmail.com", "michaelbrown", "michaelbrownpassword"] ,
        ["Emily Davis", "emilydavis@gmail.com", "emilydavis", "emilydavispassword"] ,
        ["Chris Johnson", "chrisjohnson@gmail.com", "chrisjohnson", "chrisjohnsonpassword"] ,
        ["Sarah Wilson", "sarahwilson@gmail.com", "sarahwilson", "sarahwilsonpassword"] ,
        ["David Martinez", "davidmartinez@gmail.com", "davidmartinez", "davidmartinezpassword"] ,
        ["Laura Garcia", "lauragarcia@gmail.com", "lauragarcia", "lauragarciapassword"] ,
        ["Daniel Anderson", "danielanderson@gmail.com", "danielanderson", "epassword"] ,
        ["Sophia Thomas", "sophiathomas@gmail.com", "sophiathomas", "sophiathomaspassword"] ,
        ["James Taylor", "jamestaylor@gmail.com", "jamestaylor", "jamestaylorpassword"] ,
        ["Olivia Moore", "oliviamoore@gmail.com", "oliviamoore", "oliviamoorepassword"] ,
        ["Ethan Jackson", "ethanjackson@gmail.com", "ethanjackson", "ethanjacksonpassword"] ,
        ["Ava White", "avawhite@gmail.com", "avawhite", "avawhitepassword"] ,
        ["Noah Harris", "noahharris@gmail.com", "noahharris", "noahharrispassword"] ,
        ["Mia Clark", "miaclark@gmail.com", "miaclark", "miaclarkpassword"] 
    ]

const generateAllProfiles = async () => {
        for (let i = 0; i < profile_data.length; i++) {
            const displayName = profile_data[i][0];
            const email = profile_data[i][1];
            const username = profile_data[i][2];
            const password = profile_data[i][3];
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
            }
        }
    };


            <button className="p-10 m-10 bg-gray-500" onClick={generateAllProfiles}>full send</button>