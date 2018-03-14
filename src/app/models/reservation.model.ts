export class Reservation {
    constructor(public date: string, 
                public time: string, 
                public category : string, 
                public item : string,
                public fee: number,
                public approvedStatus: boolean,
                public paidStatus: boolean,
                public matricsNo: string,
                public reservationKey: string,
                public reservationID: number,
                public userName: string){}
}