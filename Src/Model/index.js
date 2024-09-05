import mongoose from "mongoose";
import config from '../Utils/config.js'

main().catch((error)=>console.log("MongoDB Connection Failed", error))

async function main() {
    await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
    console.log("MongoDB Connected")
}

export default mongoose;