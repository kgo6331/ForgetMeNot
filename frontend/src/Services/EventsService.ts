import DynamoEventsResult from "../Models/DynamoEventsResult";
import DynamoResponse from "../Models/DynamoEventsResult";
import Events from "../Models/Events";
const EventsService = {
    async getAllEvents(){
        let temp: DynamoResponse = await fetch('https://30z74xmi3i.execute-api.us-east-2.amazonaws.com/event/all' ,{method: 'GET'}).then(result => result.json())

        let events = [] as Events[];

        temp.Items.forEach((event: Events) => {
            events.push({
                startTime : event.startTime,
                endTime: event.endTime,
                description: event.description,
                date: event.date,
                eventId: event.eventId,
                name: event.name,
                allDay: event.allDay
            });
        })
        return events;

    },

    async insertEvent(event: Events){
        var responseOptions = {
            method: 'PUT',
            body: JSON.stringify({
                'eventId': Number(event.eventId),
                'name': event.name,
                'startTime': event.startTime,
                'endTime': event.endTime,
                'date': event.date,
                'description': event.description,
                'allDay': event.allDay
            })
        }
        var temp  = await fetch('https://30z74xmi3i.execute-api.us-east-2.amazonaws.com/event', responseOptions).then(response => {return response})
        return temp;
    },

    async deleteEvent(eventId: String){
        let temp= await fetch('https://30z74xmi3i.execute-api.us-east-2.amazonaws.com/event/' + Number(eventId), {method: 'DELETE'}).then(result => result.json());
    },

    async getEventById(eventId: Number){
        let temp: DynamoEventsResult = await fetch('https://30z74xmi3i.execute-api.us-east-2.amazonaws.com/event/' + Number(eventId),{method: 'GET'}).then(result => result.json())

        return temp.Items[0];
    }

}
export default EventsService;