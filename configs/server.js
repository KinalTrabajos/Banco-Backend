'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import { createAdmin } from '../src/Auth/auth.controller.js';
import { createRoles } from '../src/role/role.controller.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import favoriteRoutes from '../src/favorites/favorite.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
}

const routes = (app) => {
    app.use('/BancoSystem/v1/auth', authRoutes);
    app.use('/BancoSystem/v1/users', userRoutes);
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
        await createAdmin();
        console.log(`Server running on port: ${port}`);
    } catch (err) {
        console.log(`Server init failed: ${err}`);
    }
}