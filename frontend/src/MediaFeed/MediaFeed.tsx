import React, { useState, useEffect } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { mediaFeedData } from "./MediaFeedData";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import IconButton from '@mui/material/IconButton';
import "./MediaFeed.css";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import {useLocation, useNavigate} from "react-router-dom";
import Patient from "../Models/Patient";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function MediaFeed() {
    const location = useLocation();
    const navigate = useNavigate()
    const handle = useFullScreenHandle();
    const [currentSlide, setCurrentSlide] = useState(0);
    const feedLength = mediaFeedData.length;

    const navigateToPatientProfile = (patient : Patient) => {
        navigate('/patientProfile', {state:{id: patient.id, firstName: patient.firstName, lastName: patient.lastName}});
    };

    const patient: Patient = {
        id: location.state != null ? location.state.id : 0,
        firstName: location.state != null ? location.state.firstName : "Test",
        lastName: location.state != null ? location.state.lastName : "Demonstration"
    };

    let slideInterval: string | number | NodeJS.Timer | undefined;
    let intervalTime = 10000;

    const prevSlide = () => {
        setCurrentSlide(currentSlide === 0 ? feedLength - 1 : currentSlide - 1);
    };

    const nextSlide = () => {
        setCurrentSlide(currentSlide === feedLength - 1 ? 0 : currentSlide + 1);
    };

    function auto() {
        slideInterval = setInterval(nextSlide, intervalTime);
    }

    useEffect(() => {
        auto();
        return () => clearInterval(slideInterval);
    }, [currentSlide]);

    return (
        <div id="mediaFeed">
            <div id="arrowButton">
                <IconButton size="large" onClick={() => navigateToPatientProfile(patient)}>
                    <ArrowBackIcon fontSize="inherit"></ArrowBackIcon>
                </IconButton>
            </div>
            <div id="feedContainer">
                <div className="mediaView">
                    <IconButton size="large" id="enterFullscreen" onClick={handle.enter}>
                        <OpenInFullIcon fontSize="inherit"></OpenInFullIcon>
                    </IconButton>
                    <FullScreen handle={handle}>
                        {mediaFeedData.map((slide, index) => {
                            return (
                                <div className={index === currentSlide ? "slide current" : "slide"} key={index}>
                                    {index === currentSlide && (
                                        <div>
                                            <img src={slide.image} alt="slide" className="image" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </FullScreen>
                </div>
                <div id="feedOptions">
                    <IconButton size="large" onClick={prevSlide}>
                        <ArrowCircleLeftIcon fontSize="inherit"></ArrowCircleLeftIcon>
                    </IconButton>
                    <IconButton size="large" onClick={nextSlide}>
                        <ArrowCircleRightIcon fontSize="inherit"></ArrowCircleRightIcon>
                    </IconButton>
                </div>
            </div>
        </div>


    );
};