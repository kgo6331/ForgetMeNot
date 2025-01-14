import * as AWS from 'aws-sdk/global';
import {AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession} from 'amazon-cognito-identity-js';
import { Auth } from "aws-amplify";
const poolData = {
    UserPoolId: 'us-east-2_fx7Pj61oL',
    ClientId: '5rokje451stq4idb8rkb8aell6'
};
const userPool = new CognitoUserPool(poolData);


// function signup(username:string, password:string, attributes: { [s: string]: string; } | ArrayLike<unknown>){
//     // var attributeList:CognitoUserAttribute[] = [];

//     // for (const [key, value] of Object.entries(attributes)){
//     //     attributeList.push(new CognitoUserAttribute({Name: key, Value: value}))
//     // }

//     // userPool.signUp(username, password, attributeList, null, function (
//     //     err, result) {
//     //     if (err) {
//     //         alert(err.message || JSON.stringify(err));
//     //     }
//     // })
// }



function getRequestHeaders(method: string, body:object){
    // method: 'post', 
    // headers: new Headers({
    //     'Authorization': 'Basic '+btoa('username:password'), 
    //     'Content-Type': 'application/x-www-form-urlencoded'
    // }), 
    // body: 'A=1&B=2'


    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + getToken())
    
    // myHeaders.append("Access-Control-Max-Age", "0");
    
    if (method.toLowerCase() === 'get' || method.toLowerCase() === 'delete'){
        return {
            method: method,
            headers: new Headers({'Authorization': 'Bearer' + getToken()})
        }
    } else {
        return {
            method: method,
            headers: new Headers({'Authorization': 'Bearer ' + getToken()}),
            body: JSON.stringify(body)
        }
    }
}

function isAuthenticated() {
    const cognitoUser = userPool.getCurrentUser();
    let valid_session:boolean = false

    if (cognitoUser) {
        cognitoUser.getSession(function (error: any, session: CognitoUserSession) {
            if (!error){
                valid_session = session.isValid()
            }
        });
    }

    return valid_session
}

function getRole() {
    const cognitoUser = userPool.getCurrentUser();
    let role:String = 'None';

    if (cognitoUser) {
        cognitoUser.getSession(function (error: any, session: CognitoUserSession) {
            if (!error && session.isValid()){
                role = session.getIdToken().payload['cognito:groups']
                console.log('role: ' + role);
            }
        });
    }
    return role[0].toLowerCase()

}

function getToken() {
    const cognitoUser = userPool.getCurrentUser();
    let token:String = 'Error: Token Not Found';
    // console.log(
    // Auth.currentAuthenticatedUser().then((user) =>{
    //     return user.session.getIdToken().getJwtToken();
    // }));
    if (cognitoUser) {
        cognitoUser.getSession(function (error: any, session: CognitoUserSession) {
            if (!error && session.isValid()){
                token = session.getIdToken().getJwtToken();
                console.log(session.getIdToken().payload);
            }
        });
    }
    return token.toString();
}

function login(username: string, password: string){
    const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password
    });
    const userData = {
        Username: username,
        Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            //POTENTIAL: Region needs to be set if not already set previously elsewhere.
            AWS.config.region = 'us-east-2';

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-2:49f28723-d9d1-472a-969b-99907c51b2e0', // your identity pool id here
                Logins: {
                    // Change the key below according to the specific region your user pool is in.
                    'cognito-idp.us-east-2.amazonaws.com/us-east-2_fx7Pj61oL': result
                        .getIdToken()
                        .getJwtToken(),
                },
            });
            console.log('Successfully logged in!')
            window.location.href='/'
            console.log(result.getIdToken().getJwtToken())
            console.log(getRole())
        }, onFailure: function (err) {
            alert(err.message || JSON.stringify(err));
        }
    })
    
}

function logout(){
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser){
        cognitoUser.signOut();
    }
}

export {login, logout, isAuthenticated, getRole, getToken, getRequestHeaders}