const data = {};
data.employees = require('../model/employees.json');

const getAllEmployees = (request, response) => {
    // retrieve data from a server, requests data w/o modifying it
    response.json(data.employees);
}

const createNewEmployee = (request, response) => {
    // create new resource or submit data for processing
    response.json({
        "firstname": request.body.firstname,
        "lastname": request.body.lastname
    });
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