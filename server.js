import connectdb from "./src/config/db.config.js";
import { adminRoutes, cors, express } from "./src/index.js";
export const jwtKey="admin-login";
const app = express();
import dotenv from "dotenv"
dotenv.config();
const Port=process.env.PORT;
const DB_URL=process.env.DB_URL;
app.use(cors())
app.use(express.json());


app.use("/api/admin",adminRoutes)





app.listen(Port, () => {
  connectdb(DB_URL);
  console.log(`server running port ${Port}`);
});
