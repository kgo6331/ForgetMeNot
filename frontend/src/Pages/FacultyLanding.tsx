import { Box, Card, CardContent, CardHeader, Grid,styled, Typography } from "@mui/material";
import "./Landing.css";
import RestaurantTwoToneIcon from '@mui/icons-material/Restaurant';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonth';
import PersonSearchTwoToneIcon from '@mui/icons-material/PersonSearch';
import SettingsIcon from '@mui/icons-material/Settings';
import QuizTwoToneIcon from '@mui/icons-material/QuizTwoTone';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { Link } from "react-router-dom";
import {isAdmin, redirectFacility} from "../Services/getRole";

const Item = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    width: "100%",
    color: theme.palette.text.secondary,
    height: "10rem",
  }));
function FacultyLanding(props: any){

    redirectFacility()
    return (
        <div id="landing">
            
            <Card id="card" sx={{boxShadow: 3}}>
                <CardContent>
                    <Typography variant="h4">Available actions:</Typography>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={4} id="gridItem">
                                <Link to={"/menu"}>
                                    <Item id="actionItem">
                                        <Typography variant="subtitle1">Menu</Typography>
                                        <RestaurantTwoToneIcon id="icon"/>
                                    </Item>                                    
                                </Link>
                            </Grid>
                            <Grid item xs={4}>
                                    <Link to={"/facultyCalendar"}>
                                        <Item  id="actionItem">
                                            <Typography variant="subtitle1">Calendar</Typography>
                                            <CalendarMonthTwoToneIcon id="icon"/>
                                        </Item>
                                    </Link>
                            </Grid>
                            <Grid item xs={4}>
                                <Link to={"/patientInfo"}>
                                    <Item id="actionItem">
                                        <Typography variant="subtitle1">Patient Profiles</Typography>
                                        <PersonSearchTwoToneIcon id="icon"/>
                                    </Item>
                                </Link>
                                
                            </Grid>
                            {!isAdmin() ? <div></div> :
                                <Grid item xs={4}>
                                    <Link to="/configs">
                                        <Item id="actionItem">
                                            <Typography variant="subtitle1">Configs</Typography>
                                            <SettingsIcon id="icon"/>
                                        </Item>
                                    </Link>
                                </Grid>
                            }
                            {!isAdmin() ? <div></div> :
                                <Grid item xs={4}>
                                    <Link to="/questionControl">
                                        <Item id="actionItem">
                                            <Typography variant="subtitle1">Question Control</Typography>
                                            <QuizTwoToneIcon id="icon"/>
                                        </Item>
                                    </Link>
                                </Grid>
                            }
                            {!isAdmin() ? <div></div> :
                                <Grid item xs={4}>
                                    {/* fix route */}
                                    <Link to="/facultyUpload">
                                        <Item id="actionItem">
                                            <Typography variant="subtitle1">Upload Orientation Video</Typography>
                                            <OndemandVideoIcon id="icon"/>
                                        </Item>
                                    </Link>
                                </Grid>
                            }
                        </Grid>
                    </Box>                   
                </CardContent>
            </Card>
 
        </div>
    )
}
export default FacultyLanding;