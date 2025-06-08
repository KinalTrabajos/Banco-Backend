'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import limiter from '../src/middlewares/validate-cant-peticiones.js';
import { dbConnection } from './mongo.js';
import { createAdmin } from '../src/auth/auth.controller.js';
import { createRoles } from '../src/role/role.controller.js';
import favoriteRoutes from '../src/favorites/favorite.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use('/BancoSystem/v1/favorites', favoriteRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexión a la base de datos exitosa");
    } catch (error) {
        console.error('Error conectando a la base de datos', error);
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        await createRoles();
        console.log(`Server running on port: ${port}`);
        await createAdmin();
        setInterval(rewardPointsService, 86400000); //Cada 24 horas (si quiere para 10 s cambiar a 10000)
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
}