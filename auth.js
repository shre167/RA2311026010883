const fs = require("fs");

const auth = async () => {
    try {
        // Read saved credentials
        const creds = JSON.parse(fs.readFileSync("credentials.json"));

        const response = await fetch("http://20.207.122.201/evaluation-service/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                clientId: creds.clientId,
                clientSecret: creds.clientSecret
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("❌ Auth Failed:", err);
            return;
        }

        const data = await response.json();

        console.log("\n🎯 ACCESS TOKEN:\n");
        console.log(data);

    } catch (err) {
        console.error("Error:", err);
    }
};

auth();