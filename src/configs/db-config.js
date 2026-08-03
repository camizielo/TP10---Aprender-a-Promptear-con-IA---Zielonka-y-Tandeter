// Configuración de conexión a PostgreSQL.
//
// Las credenciales se leen desde el archivo .env (que `server.js` carga al
// arrancar con `import 'dotenv/config'`), así NO quedan escritas en el código.
//
// 👉 Para cambiar de base, editá UNA sola línea en el .env:
//        DB_TARGET = "local"      → PostgreSQL en tu máquina
//        DB_TARGET = "supabase"   → PostgreSQL en la nube (Supabase)
//
// Según ese valor tomamos el juego de variables que corresponda:
// las DB_LOCAL_* o las DB_SUPABASE_*.
const target = (process.env.DB_TARGET ?? 'local').trim().toLowerCase();
const prefix = target === 'supabase' ? 'DB_SUPABASE_' : 'DB_LOCAL_';

// Validación del certificado TLS de Supabase:
// Supabase emite sus certificados a través de una cadena de confianza
// pública (no autofirmados), así que en la gran mayoría de los casos
// `rejectUnauthorized: true` valida correctamente sin configuración extra.
// Se deja como default seguro. Si en tu instancia puntual de Supabase la
// conexión falla por un error de certificado (ej: "self signed certificate
// in certificate chain" o similar), es una LIMITACIÓN CONOCIDA a verificar
// caso por caso — podés desactivar la validación temporalmente seteando
// DB_SUPABASE_SSL_REJECT_UNAUTHORIZED=false en tu .env, dejando explícito
// en el .env.example que esto reduce la seguridad de la conexión.
const sslRejectUnauthorized = (process.env.DB_SUPABASE_SSL_REJECT_UNAUTHORIZED ?? 'true').trim().toLowerCase() !== 'false';

const DBConfig = {
    host     : process.env[prefix + 'HOST']     ?? 'localhost',
    database : process.env[prefix + 'DATABASE'] ?? '',
    user     : process.env[prefix + 'USER']     ?? '',
    password : process.env[prefix + 'PASSWORD'] ?? '',
    port     : process.env[prefix + 'PORT']     ?? 5432,
    // Supabase (y casi todas las bases en la nube) exigen SSL; la local no.
    ssl      : target === 'supabase' ? { rejectUnauthorized: sslRejectUnauthorized } : false
    //max                     : 20,       //maximum number of clients the pool should contain by default this is set to 10.
    //idleTimeoutMillis       : 30000,
    //connectionTimeoutMillis : 2000
}

console.log(`db-config: conectando a la base "${target}"`);
if (target === 'supabase' && !sslRejectUnauthorized) {
    console.log('⚠️  db-config: SSL con rejectUnauthorized=false — validación de certificado deshabilitada.');
}

export default DBConfig;