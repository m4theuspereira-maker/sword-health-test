import express, { Router } from "express";
import cors from "cors";


const routes = Router();
routes.use(cors())
routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));
