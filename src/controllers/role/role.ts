import { Request, Response } from "express"; 
import Role from "../../models/Role";
import Permission from "../../models/permission";

export const findAll = async(req: Request, res: Response) => {
    const roles = await Role.aggregate([
        { $match: {} },
        { $project: { value: 1, permissions: 1, label: 1 } }
    ]);
    res.status(200).json(roles);
};


export const createOrUpdate = async(req: Request, res: Response) => {
    const { role: {_id, ...others} } = req.body;
    const result = await Role.updateOne({value: others.value}, others, {upsert: true}).lean().exec();

    return res.status(200).send(result);
};

export const insertOne = async(req: Request, res: Response) => {
    const { body } = req;
    const role = new Role(body);
    const result = await role.save();

    return res.status(200).send(result);
};

export const findOneById = async(req: Request, res: Response) => {
    const id = req.params.leadId;
    const lead = await Role.findById(id);

    res.status(200).send(lead);
};


export const patch = (req: Request, res: Response) => {
    const id = req.params.productId;
    const updateOps: {[index: string]: any} = {};
    for (const ops of req.body) {
        const propName = ops.propName;
        updateOps[propName] = ops.value;
    }
    Role.update({ _id: id }, { $set: updateOps })
        .exec()
        .then((result: any) => {
            res.status(200).json({
                message: "Lead updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/lead/" + id
                }
            });
        })
        .catch((err:any) => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

export const deleteOne = (req: Request, res: Response) => {
    const id = req.params.productId;
    Role.remove({ _id: id })
        .exec()
        .then((result: any) => {
            res.status(200).json({
                message: "Lead deleted",
                request: {
                    type: "POST",
                    url: "http://localhost:3000/lead",
                    body: { name: "String", price: "Number" }
                }
            });
        })
        .catch((err:any) => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


export const addPermission = async(req: Request, res: Response) => {
    const { permission } = req.body;
    console.log(permission);
    const result = await Permission.create(permission);


    return res.status(200).send(result);
};


export const getAllPermissions = async(req: Request, res: Response) => {
    const response = await Permission.find({}).lean().exec();


    return res.status(200).send(response);
};

export const getPermissionsArray = async(roleType: string) => {
    console.log(roleType);
    const result = await Role.findOne({value: roleType}, {permissions: 1}).lean().exec() as any;
    const permissions = result.permissions.map((permission: any)=>permission.value);


    return permissions;
};