import express from 'express';
import morgan from 'morgan';
import path from 'path';

// * config dotenv
import dotenv from 'dotenv';
dotenv.config();

import './database/database';
import userRoutes from './routes/users';
import notesRoutes from './routes/notes';

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// ! routes
app.use('/users', userRoutes);
app.use('/notes', notesRoutes);

export default app;
