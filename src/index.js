import dotenv from "dotenv";
import connectToDB from "./db/db.js";
dotenv.config({ path: "./.env" });
import app from "./app.js";

connectToDB()
    .then(() => {
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running at the port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log(`Connection failed with DB `, error);
    });
