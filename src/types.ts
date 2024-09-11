export type Locker = {
    lockerNumber: number,
    combination?: string,
    expiryDate?: string,
    year?: number,
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