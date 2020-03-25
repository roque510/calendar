import moment from 'moment';
import time from '../../src/timeObject';

const initialState = {
    reminders: 
    {
        '26/03/2019':[
            {
                sort:34,
                time:"05:00 PM",
                title:"SCHOOL TEST",
                color:"red"
            }
        ]
    }
};

function getKeyByValue(object, value) { 
    for (var prop in object) { 
        if (object.hasOwnProperty(prop)) { 
            if (object[prop] === value) 
            return prop; 
        } 
    } 
} 



const reducer = (state = initialState , action ) => {
    const newState = { ...state};    
    if (action.type === 'ADD_REMINDER'){
        //check if exists, if not create an empty one.
        //push new items
        
        if(action.payload.title.length < 31) {
            console.log('aaiiaia',action.payload.city);
            if(action.payload.city?.length > 0) {
                newState.reminders[action.payload.date] = newState.reminders[action.payload.date] || [];
                newState.reminders[action.payload.date].push({time:action.payload.time,title:action.payload.title,color:action.payload.color,sort:action.payload.sort,city:action.payload.city,weather:action.payload.weather});
                // newState.reminders[action.payload.date].title = action.payload.title;
                newState.reminders[action.payload.date] = newState.reminders[action.payload.date].sort((a,b)=>a.sort-b.sort);
            }
        }
        
    }
    if (action.type === 'EDIT_REMINDER'){
        
        const newDate = moment(action.payload.date, "YYYY-MM-DD").format("DD/MM/YYYY");

        newState.reminders[newDate] = newState.reminders[newDate] || [];
        //first we delete
        newState.reminders[action.payload.mapDay].splice(action.payload.index,1);
        //then we add
        
        //push new items
        newState.reminders[newDate].push({time:action.payload.ntime,title:action.payload.title,city:action.payload.city,color:action.payload.color,sort:action.payload.sort,weather:action.payload.weather});
        // newState.reminders[action.payload.date].title = action.payload.title;
        
        newState.reminders[newDate] = newState.reminders[newDate].sort((a,b)=>a.sort-b.sort);

        // newState.reminders[action.payload.mapDay][action.payload.index] = {time:action.payload.ntime,title:action.payload.title,color:action.payload.color,sort:action.payload.sort};
        // newState.reminders[action.payload.date].title = action.payload.title;
    }
    if (action.type === 'DELETE_REMINDER'){
        newState.reminders[action.payload.mapDay].splice(action.payload.index,1);
    }

    if (action.type === 'DELETE_ALL_REMINDER'){
        delete newState.reminders[action.payload];
    }
    
    

    return newState

};

export default reducer;
