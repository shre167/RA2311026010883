// Fill in your personal details below
const registrationData = {
    email: "ss1174@srmist.edu.in",
    name: "SHREYA SAMAL",
    mobileNo: "8483969928",
    githubUsername: "shre167",
    rollNo: "RA2311026010883",
    accessCode: "QkbpxH" // From the email you received
};

const register = async () => {
    console.log("Registering with the Test Server...");
    try {
        const response = await fetch("http://20.207.122.201/evaluation-service/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registrationData)
        });

        if (!response.ok) {
            console.error("Failed to register. Status:", response.status);
            const errorText = await response.text();
            console.error("Error details:", errorText);
            return;
        }

        const data = await response.json();
        console.log("\n✅ Registration Successful!");
        console.log("\n=======================================================");
        console.log("Here is your Access Token (save this somewhere safe!):");
        console.log("=======================================================\n");
        console.log(JSON.stringify(data, null, 2));
        console.log("\n=======================================================");
        
        if (data.access_token) {
            console.log("\nYou can use this token to initialize your logging middleware like this:");
            console.log(`initLogger({ token: "${data.access_token.substring(0, 20)}..." });`);
        }
        
    } catch (error) {
        console.error("An error occurred during registration:", error);
    }
};

register();
