import Ajv from 'ajv';
const ticketValidator = (data: any) => {
    const schema = {
        type: "array",
        items: {
            type: "object",
            required: ['leadId', 'email'],
            properties: {
                leadId: {type: "string"},
                email: {type: "string"},
                assignedTo: {type: "string"}
            },
        }
    }
    var ajv = new Ajv({
        allErrors:true,
        verbose: true
    });
    var validate = ajv.compile(schema);
    
    var valid = validate(data);

    return {valid, validate}
}

export default ticketValidator;