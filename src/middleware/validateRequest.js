import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
    try {
        // Här validera body, query och params mot schemat
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    } catch (error) {
        return res.status(400).json({ 
            message: "Validation failed", 
            errors: error.error.map((e) => ({
                field: e.path[1],
                message: e.message,
            }))
        });
    }
};
