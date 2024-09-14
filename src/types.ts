export type Locker = {
    id: string,
    lockerNumber: number,
    ownerEmail: string,
    previousOwnerEmail: string,
    combination: string,
    expiryDate: string,
    newExpirationDate: string,
    status: string,
    notes: string,
    year: number,
}

export type Order = {
    id: string,
    type: string,
    user_email: string,
    locker_id: number,
    status: string,
    transaction_id: string,
    expiry: string,
    year: number,
    created_at: string
}