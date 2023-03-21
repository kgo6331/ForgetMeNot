export default interface Events{
    eventId: string
    name: string
    startTime: string
    date?: string
    endTime?: string
    description?: string
    allDay: boolean
    daysOfWeek? : string[]
    recurring: boolean
    recFreq? : string
}