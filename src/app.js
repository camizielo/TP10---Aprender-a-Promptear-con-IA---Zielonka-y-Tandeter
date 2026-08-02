import 'dotenv/config'
import express 	from "express";
import cors 	from "cors";

// Controllers
import AlumnosController    from "./controllers/alumnos-controller.js"
import CursosController     from "./controllers/cursos-controller.js"
import MateriasController   from "./controllers/materias-controller.js"
import authController from './controllers/auth-controller.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/alumnos", AlumnosController);
app.use("/api/cursos" , CursosController);
app.use("/api/materias", MateriasController);
app.use('/api/auth', authController);

export default app;