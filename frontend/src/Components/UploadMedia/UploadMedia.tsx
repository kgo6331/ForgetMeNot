import React, {useState} from "react";
import './UploadMedia.css';
import Thumbnail from "./Thumbnail/Thumbnail"
import GetMedia from "../../Services/GetMedia";
import Media from "../../Models/Media";
import UploadMediaService from "../../Services/UploadMediaService";

import {redirectLoggedIn} from "../../Services/getRole";

import {Puff} from 'react-loader-spinner';
import {Dialog, IconButton, Tooltip} from "@mui/material";
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

function UploadMedia(props: any) {
    redirectLoggedIn()
    let patient = props.patient;

    const [mediaFiles, setMedia] = useState<Media[]>();
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [isGreetingUploaded, setIsGreetingUploaded] = useState(false);

    const openFileUpload = () => {
        const input = document.getElementById('file-input');
        if (input) {
            input.click();
        }
    };

    const openMediaFileUpload = () => {
        const input = document.getElementById('media-input');
        if (input) {
            input.click();
        }
    };

    const initializeData = async() => {
        //initializes the questions
        await initializeMedia();
        setDataLoaded(true);
    }

    async function onImageChange(e: any, isGreeting?: boolean) {
       uploadMediaFile(e.target.files, isGreeting);
    }

    const deleteCallback = async (id: string, isGreeting?: boolean, isOrientation?: boolean) =>{
        setMediaLoading(true);
        await initializeMedia();
        setMediaLoading(false);
        if(isGreeting){setIsGreetingUploaded(false)}
    }

    const initializeMedia = async () => {
        await GetMedia.initializeMedia(patient.id.toString(), "patient");
        setMedia(GetMedia.mediaMetadata);
        setIsGreetingUploaded(GetMedia.greetingUploaded);
    }

    const uploadMediaFile = async (file : File[], isGreeting?: boolean) =>{
        setMediaLoading(true);
        for(let i = 0; i < file.length; i++){
            await UploadMediaService.uploadMedia(patient.id.toString(), "patient", file[i], isGreeting);
        }
        await initializeMedia();
        setMediaLoading(false)
    }

    if(!dataLoaded){
        initializeData();
    }

    if(!dataLoaded){
        return (
            <div id="mediaUpload">
                <Dialog disableScrollLock={true} open={!dataLoaded} id="loadingScreenDialog">
                    <Puff   height="80"
                            width="80"
                            radius={1}
                            color="#EFF1FB" visible={!dataLoaded} />
                </Dialog>
            </div>
        )
    }else {
        return (
            <div>

            <Dialog disableScrollLock={true} open={mediaLoading} id="loadingScreenDialog">
                <Puff   height="80"
                        width="80"
                        radius={1}
                        color="#EFF1FB" visible={mediaLoading} />
            </Dialog>
            <div id="mediaUpload" hidden={mediaLoading}>
                <section className="mediaUploadSection">
                    <div id="sectionTitle">
                        <div>
                            <span>
                                <Tooltip title="A single video that will be displayed to your family member every morning. It is recommended to
                                                include information about why they are at the facility, and that they are safe. " placement="right" enterTouchDelay={0}>
                                    <IconButton size="large">
                                        <InfoRoundedIcon fontSize="inherit"></InfoRoundedIcon>
                                    </IconButton>
                                </Tooltip>
                                Greeting Video
                            </span>
                        </div>
                    </div>
                    <div className="imageGrid">
                        {mediaFiles?.map((element) => {
                            const re = /(?:\.([^.]+))?$/;
                            if (re.exec(element.objectKey)![1] === "mp4" && element.isGreeting) {
                                return <Thumbnail media={element} isVideo={true} callback={deleteCallback}></Thumbnail>
                            }
                        })}
                    </div>

                    <br/>

                    <div hidden={isGreetingUploaded}>
                        <button type="button" className="uploadButton" onClick={openFileUpload}>+ Add Video</button>
                        <input
                            type="file"
                            accept="video/mp4,video/x-m4v,video/*"
                            style={{display: 'none'}}
                            id="file-input"
                            onChange={async (e) => await onImageChange(e,true)}
                        />
                    </div>

                </section>
                <section className="mediaUploadSection">
                
                <div hidden={mediaLoading}>
                    <div id="sectionTitle">
                        <div>
                            <span>
                                <Tooltip title="General images and videos that will be displayed to your family member
                                                via the memory feed." placement="right" enterTouchDelay={0}>
                                    <IconButton size="large">
                                        <InfoRoundedIcon fontSize="inherit"></InfoRoundedIcon>
                                    </IconButton>
                                </Tooltip>
                                Memory Feed Media
                            </span>
                        </div>
                    </div>
                    <div className="imageGrid">
                        {mediaFiles?.map((element) => {
                            const re = /(?:\.([^.]+))?$/;
                            if (!element.isGreeting){
                                if (re.exec(element.objectKey)![1] === "mp4") {
                                    return <Thumbnail media={element} isVideo={true} callback={deleteCallback}></Thumbnail>
                                } else {
                                    return <Thumbnail media={element} isVideo={false} callback={deleteCallback}></Thumbnail>
                                }
                            }
                        })}
                    </div>

                    <br/>

                    <div>
                        <button type="button" className="uploadButton" onClick={openMediaFileUpload}>+ Add Images</button>
                        <input
                            type="file" multiple
                            accept="image/*,video/mp4,video/x-m4v,video/*"
                            style={{display: 'none'}}
                            id="media-input"
                            onChange={async (e) => await onImageChange(e,false)}
                        />
                    </div>
                </div>
                    
                </section>
            </div>
            </div>
        )
    }
}

export default UploadMedia