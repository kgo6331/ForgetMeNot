
import { useState } from "react";
import './AboutYou.css';
import Question from "../../Models/Question";
import { MenuItem, Select, TextField, Box } from "@mui/material";
import DynamoResponse from "../../Models/DynamoResponse";
import PersonalityTraits from "./PersonalityTraits/PersonalityTraits";
import SendResponse from "../../Models/SendResponse";
import UploadResponseService from "../../Services/UploadResponseService";
import GetQuestions from "../../Services/GetQuestions";
export const AboutYou = () => {
    const [questions, setQuestions] = useState<Question[]>();
    

    var personalityTraits : Question[] = [];
    
    const initializeQuestions = async () => {
         await GetQuestions.initializeQuestions();
         setQuestions(GetQuestions.questions.sort((a,b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
        
    }
    //initializes the questions
    initializeQuestions();

    const onBlurEvent = (value: string, question : Number) => {
        console.log(value)
        
        var change = { questionId: question, response: value} as SendResponse
        // var traits : SendResponse[] = []
        
        UploadResponseService.setFormDirty(change, value)
        
    }
    const getSelect = (question: Question) =>{
        return(
            <div id={question.id.toString()} className={question.questionType}>
                <label>
                    {question.prompt}
                </label>
                <Select id={question.id.toString()} className={question.questionType} defaultValue={"none"} onChange={(event) => onBlurEvent(event.target.value, question.id)}>
                    <MenuItem value="none" disabled hidden>Select an Option</MenuItem>
                    {question.selectOptions?.map(element => { return <MenuItem value={element}>{element}</MenuItem> })}
                </Select>
            </div>
        )
    }
    const getSingleLine = (question: Question) => {
        return(
            <div id={question.id.toString()} className={question.questionType}>
                <label htmlFor={question.id.toString()}>
                    {question.prompt}
                </label>
                <TextField id={question.id.toString() + "_resp"}className={question.questionType}  onBlur={(event) => onBlurEvent(event.target.value, question.id)} variant="outlined"/>
            </div>
        )
    }
    const getMultiLine = (question: Question) => {
        return(
            <div id={question.id.toString()} className={question.questionType}>
                <label>
                    {question.prompt}
                </label>
                <TextField id={question.id.toString() + "_resp"}className={question.questionType}  variant="outlined" onBlur={(event) => onBlurEvent(event.target.value, question.id)} rows={4} multiline/>
            </div>
        )
    }

    const makeQuestionComponent = (question: Question) =>{
        switch(question.questionType){
            case "singleLine":
                return getSingleLine(question);
            case "multiLine":
                return getMultiLine(question);
            case "select":
                return getSelect(question);
            case "checkbox":
                personalityTraits.push(question);
        }
    }
    return (
        <div>
        <div id="aboutYou">
            <form className="AboutYou">
                {questions?.map(element =>{
                    return makeQuestionComponent(element)
                })}
                <PersonalityTraits traits={personalityTraits}/>
            </form>

        </div>
    </div>
    )
}