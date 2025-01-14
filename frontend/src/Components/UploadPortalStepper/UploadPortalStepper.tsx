import React from 'react';
import AccordionStepper from './AccordionStepper/AccordionStepper';
import "./UploadPortalStepper.css"
import Patient from "../../Models/Patient"
import {redirectLoggedIn} from "../../Services/getRole";

function UploadPortalStepper() {
    redirectLoggedIn()

    // this is used for demonstration
    // Eventually the actual ID and patient info will need to be
    // added for the Family Form
    const patient: Patient = {
        id: 0,
        firstName: "Test",
        lastName: "Demonstration",
        dob: "1955-01-01",
        companyId: 11212
    }
    const allowInput: boolean = true;

    return (
        <>
            <div id="UploadPortalStepper">
                <h1>
                    Family Upload Portal
                </h1>
                {<AccordionStepper patient={patient} allowInput={allowInput}/>}
            </div>
        </>
);
}

export default UploadPortalStepper;