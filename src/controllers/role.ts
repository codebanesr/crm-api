import { NextFunction, Request, Response } from "express";
import Role from "../models/role";
import Permission from "../models/permission";

export const findAll = async(req: Request, res: Response, next: NextFunction) => {
    const roles = await Role.aggregate([
        { $match: {} },
        { $project: { value: 1, permissions: 1, label: 1 } }
    ]);
    res.status(200).json(roles);
};


export const createOrUpdate = async(req: Request, res: Response, next: NextFunction) => {
    const { role } = req.body;

    const result = await Role.updateOne({value: role.value}, role, {upsert: true}).lean().exec();

    return res.status(200).send(result);
}

export const insertOne = async(req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    const role = new Role(body);
    const result = await role.save()

    return res.status(200).send(result);
};

export const findOneById = async(req: Request, res: Response, next: NextFunction) => {
    const id = req.params.leadId;
    const lead = await Role.findById(id);

    res.status(200).send(lead);
};


export const patch = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.productId;
    const updateOps: {[index: string]: any} = {};
    for (const ops of req.body) {
        const propName = ops.propName;
        updateOps[propName] = ops.value;
    }
    Role.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Lead updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/lead/" + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

export const deleteOne = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.productId;
    Role.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "Lead deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/lead",
                    body: { name: "String", price: "Number" }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


export const addPermission = async(req: Request, res: Response, next: NextFunction) => {
    const { permission } = req.body;
    console.log(permission);
    const result = await Permission.create(permission);


    return res.status(200).send(result);
}


export const getAllPermissions = async(req: Request, res: Response, next:NextFunction) => {
    const response = await Permission.find({}).lean().exec()


    return res.status(200).send(response);
}