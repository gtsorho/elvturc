import { Request, Response } from 'express';
import Joi from 'joi';
import db from '../models';
import jwt from 'jsonwebtoken';


const schema = {
    create: Joi.object({
        phone: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    }),

    update: Joi.object({
        id:Joi.number(),
        phone: Joi.string(),
        username: Joi.string(),
        password: Joi.string().min(6),
        role: Joi.string(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    })
};

export default {
    login: async (req: Request, res: Response): Promise<any> => {
        const { username, password } = req.body;
        try {
            const user = await db.user.findOne({ where: { username } });

            if (!user || !(await user.isValidPassword(password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ username: user.username, id: user.id, role: user.role, InstitutionID: user.InstitutionId }, process.env.JWT_KEY!, { expiresIn: '1h' });

            res.json({ token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    async create(req: Request, res: Response): Promise<any> {
        try {
            const { error, value } = schema.create.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const user = await db.user.create(value);
            res.status(201).json(user);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async getAll(req: Request, res: Response) {
        try {
            const users = await db.user.findAll({attributes:{exclude: ["password"]}});
            res.status(200).json(users);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async getOne(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const user = await db.user.findByPk(id, {attributes:{exclude: ["password"]}});
            if (!user) return res.status(404).json({ error: 'User not found' });

            res.status(200).json(user);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async update(req: Request, res: Response) : Promise<any>  {
        try {
            const { id } = req.params;
            const { error, value } = schema.update.validate(req.body);
            if (error) return res.status(400).json({ error: error.details[0].message });

            const user = await db.user.findByPk(id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            const updatedUser = await db.user.update(value);
            res.status(200).json(updatedUser);
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },

    async delete(req: Request, res: Response) : Promise<any> {
        try {
            const { id } = req.params;
            const user = await db.user.findByPk(id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            await db.user.destroy();
            res.status(204).send();
        } catch (err: any) {
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    }
};
