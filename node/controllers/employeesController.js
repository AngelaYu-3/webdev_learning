const Employee = require('../model/Employee');

const getAllEmployees = async (request, response) => {
    // retrieve data from a server, requests data w/o modifying it
    const employees = await Employee.find();
    if (!employees) return response.status(204).json({ 'message': 'no employees found.'});
    response.json(employees);
}

const createNewEmployee = async (request, response) => {
    // create new resource or submit data for processing
    if (!request?.body?.firstname || !request?.body?.lastname) {
        return response.status(400).json({'message': 'first and last names are required'});
    }

    try {
        const result = await Employee.create({
            firstname: request.body.firstname,
            lastname: request.body.lastname
        });
    } catch (err) {
        console.error(err);
    }
    response.status(201).json(result);
}

const updateEmployee = (request, response) => {
    // update existing resources or create if doesn't exist
    response.json({
        "firstname": request.body.firstname,
        "lastname": request.body.firstname
    });

}

const deleteEmployee = (request, response) => {
    response.json({ "id": request.body.id });
}

const getEmployee = (request, response) => {
    response.json({ "id": request.params.id })
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee
}