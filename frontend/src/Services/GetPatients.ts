import DynamoResponse from "../Models/DynamoPatientResult";
import Patient from "../Models/Patient";

const GetPatients = {
    patients : [] as Patient[],

    initializePatients : async function() {
        let temp: DynamoResponse = await fetch('https://30z74xmi3i.execute-api.us-east-2.amazonaws.com/patient/all', {method: 'GET'}).then(result => result.json())

        this.patients = temp.Items;
    }
};

export default GetPatients;