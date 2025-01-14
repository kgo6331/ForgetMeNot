import { EventInput } from "@fullcalendar/core";
import { Button, Card, CardActionArea, CardActions, CardContent, Dialog, DialogContent, DialogTitle, IconButton, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import MenuItems from "../../../Models/MenuItem";
import MenuItemService from "../../../Services/MenuItemService";
import spinner from "../../../Assets/loadingspinner.gif"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import "./Menu.css";
import AddIcon from '@mui/icons-material/Add';
import AddEditMenuItem from "./AddEditMenuItem";
import CloseIcon from '@mui/icons-material/Close';

import {redirectLoggedIn} from "../../../Services/getRole";

import { Puff } from "react-loader-spinner";


function Menu(props: any){
    redirectLoggedIn()
    /* *************Function States************* */
    const [existingMenuItems, setExistingMenuItems] = useState([] as MenuItems[]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
    const [addMealType, setAddMealType] = useState(0);
    const [editableMeal, setEditableMeal] = useState(null as MenuItems | null);


    // Retrieves existing menu items from the database using MenuItemService
    const getExistingMenuItems = async () =>{
        await MenuItemService.getAllMenuItems().then((val) =>{
            setExistingMenuItems(val);
        });
    };

    //If the data is not loaded yet, load it and set DataLoaded to true
    if(!dataLoaded){
        getExistingMenuItems();
        setDataLoaded(true);
    }

    //Calls the deleteMenuItem in MenuItemService with the itemID to have it deleted from the db then refreshes the menuItems
    const handleDelete = async (item : MenuItems) =>{
        await MenuItemService.deleteMenuItem(item.id);
        await getExistingMenuItems();
    }
    //callback function to close the dialog
    const handleCallback = async(items : MenuItems) =>{
        setAddEditDialogOpen(false);
    }

    // Creates card component for each individual menu item
    const getCard = (item : MenuItems) =>{
        return (
            <div>
                <Card variant="outlined">
                    <CardContent>
                        <Typography sx={{fontSize: "2rem;"}}>{item.name}</Typography>
                        <Typography sx={{fontSize: "1rem;"}}>{item.description}</Typography>
                    </CardContent>
                    <CardActions>
                        <IconButton 
                            onClick={() => {handleDelete(item)}}>
                            <DeleteIcon/>
                        </IconButton>
                        <IconButton onClick={() =>{
                            setEditableMeal(item);
                            setAddEditDialogOpen(true);
                        }}>
                            <EditIcon/>
                        </IconButton>
                    </CardActions>

                </Card>
            </div>
        )
    }
    //renders the page
    if(!dataLoaded) {
        return (
            <div data-testid="loading-screen">
                <Dialog disableScrollLock={true} open={!dataLoaded} id="loadingScreenDialog">
                    <Puff   height="80"
                            width="80"
                            radius={1}
                            color="#EFF1FB" visible={!dataLoaded} />
                </Dialog>
            </div>
        )
    }else{
        return (
            <div>
                <h1>Menu</h1>
                <div id="menu">
                    <div id="meal">
                        <h3>Breakfast Choices: </h3>
                        {existingMenuItems?.map((val) =>{
                                if(val.mealType === 0)
                                    return getCard(val)
                            })}
                        <Button onClick={() => {setAddMealType(0); setEditableMeal(null); setAddEditDialogOpen(true)}} id="add">
                            <AddIcon/>
                        </Button>
                    </div>

                    <div id="meal">
                        <h3>Lunch Choices: </h3>
                        {existingMenuItems?.map((val) =>{
                            if(val.mealType === 1)
                                return getCard(val);
                        })}
                        <Button onClick={() => {setAddMealType(1); setEditableMeal(null); setAddEditDialogOpen(true)}} id="add">
                            <AddIcon/>
                        </Button>
                    </div>

                    <div id="meal">
                        <h3>Dinner Choices: </h3>
                        {existingMenuItems?.map((val) =>{
                            if(val.mealType === 2)
                                return getCard(val);
                        })}
                        <Button onClick={() => {setAddMealType(2); setEditableMeal(null);setAddEditDialogOpen(true)}} id="add">
                            <AddIcon/>
                        </Button>
                    </div>
                </div>

                <Dialog open={addEditDialogOpen}>
                    <DialogTitle id="title">
                        <h2>Add/Edit Meal</h2>
                        <IconButton onClick={ () => setAddEditDialogOpen(false)}>
                        <CloseIcon/>
                    </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <AddEditMenuItem
                            existingMenuItems={existingMenuItems}
                            editableMeal={editableMeal}
                            mealType={addMealType}
                            parentCallback={handleCallback}/>
                    </DialogContent>
                </Dialog>
            </div>
        )
    }

    
}

export default Menu;