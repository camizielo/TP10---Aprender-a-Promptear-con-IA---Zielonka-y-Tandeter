import 'dotenv/config'
import express 	from "express";
import cors 	from "cors";

// Controllers
import AlumnosController    from "./controllers/alumnos-controller.js"
import CursosController     from "./controllers/cursos-controller.js"
import MateriasController   from "./controllers/materias-controller.js"
import authController from './controllers/auth-controller.js';

const app = express();

// Orígenes permitidos: se leen de CORS_ALLOWED_ORIGINS en .env, separados
// por comas (ej: "https://miapp.com,https://otradominio.com").
// Si la variable no está definida, se usan estos 2 orígenes de desarrollo
// local como fallback (Express en el 3000, Vite en el 5173).
const origenesPermitidos = (process.env.CORS_ALLOWED_ORIGINS ?? 'http://localhost:3000,http://localhost:5173')
    .split(',')
    .map(origen => origen.trim())
    .filter(origen => origen.length > 0);

console.log(`CORS: orígenes permitidos → ${origenesPermitidos.join(', ')}`);

const corsOptions = {
    origin: (origin, callback) => {
        // Sin header Origin (Postman, curl, llamadas servidor-a-servidor,
        // apps móviles): no es un navegador aplicando same-origin policy,
        // así que se permite sin chequear la whitelist.
        if (!origin) {
            return callback(null, true);
        }
        if (origenesPermitidos.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Origen no permitido por CORS: ${origin}`));
    }
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/alumnos", AlumnosController);
app.use("/api/cursos" , CursosController);
app.use("/api/materias", MateriasController);
app.use('/api/auth', authController);

export default app;