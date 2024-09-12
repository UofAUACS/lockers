import { auth } from "@/firebase"
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth"
import { useEffect, useState } from "react"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Locker, Order } from "@/types"
import { axiosInstance } from "@/requests"
import { v4 as uuid_v4 } from 'uuid';
  

export default function MyLockers() {
    const [user, setUser] = useState<User | null>()
    const [lockers, setLockers] = useState([])
    const [order, setOrders] = useState([])

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        // @ts-ignore
        setUser(result.user)
    }

    const handleLogout = async () => {
        await auth.signOut()
        setUser(null)
    }

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setUser(user)
        })
    }, [])
    useEffect(() => {
        if (user) {
            const getLockers = async () => {
                const token = await user.getIdToken()
                const res = await axiosInstance.get("/lockers/get-my-lockers", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setLockers(res.data.lockers)
            }
            const getMyOrders = async () => {
                const token = await user.getIdToken()
                const res = await axiosInstance.get("/orders/get-my-orders", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setOrders(res.data.orders)
            }
            getLockers()
            getMyOrders()
        }
    }, [user])
    return (
        <div className="m-2">
            {user?<div className="text-md font-semibold my-3">Showing for {user?.email}, Not you? <span onClick={handleLogout} className="hover:cursor-pointer text-blue-600">Signout</span></div>:
            <div className="text-md font-semibold my-3">Please sign in to view your lockers. <div onClick={handleLogin} className="hover:cursor-pointer text-blue-500">Sign in with Google</div>
            <div>Use desktop to sign in. Mobile sign in not yet supported.</div>
            </div>}
            <div>
                <div className="text-2xl font-semibold">My Lockers</div>
                {lockers && lockers.length > 0 ? <div className="flex flex-row flex-wrap">
                    {lockers.map((locker: any) => {return <LockerCard locker={locker} key={uuid_v4()}/>})}
                </div> : <div className="p-5">No lockers to show</div>}
            </div>
            <div>
                <div className="text-2xl font-semibold">My Orders</div>
                {order && order.length > 0?<div className="flex flex-row flex-wrap">
                    {order.map((order: Order) => {return <OrderCard order={order} key={uuid_v4()}/>})}
                </div>: <div className="p-5">No orders to show</div>}
            </div>
        </div>
    )
}

const OrderCard = ({ order }: {order: Order}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "approved":
                return "bg-green-200"
            case "rejected":
                return "bg-red-200"
            case "pending":
                return "bg-yellow-200"
            default:
                return "tbgext-yellow-200"
        }
    }
    return (
        <Card className="w-40 m-3">
            <CardHeader>
                <CardTitle>Locker {order.locker_id}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-sm flex flex-col space-y-1">
                    <div>Status:</div> 
                    <div className={`${getStatusColor(order.status)} p-1 rounded-md text-center`}>{order.status}</div>
                </div>
            </CardContent>
            <CardFooter>
                
            </CardFooter>
        </Card>
    )
}

const LockerCard = ({ locker }: {locker: Locker}) => {
    const [combinationHidden, setCombinationHidden] = useState(true)
    return (
        <Card className="w-40 m-3">
            <CardHeader>
                <CardTitle>Locker {locker.lockerNumber}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-sm flex flex-col space-y-1">
                    <div>Combination:</div>
                    <div className="flex flex-row justify-between">
                        <div>{combinationHidden ? <div className=" border rounded-sm p-1 hover:cursor-pointer" onClick={() => setCombinationHidden(false)}>Show</div> : <div className="hover:cursor-pointer p-1" onClick={() => setCombinationHidden(true)}>{locker.combination}</div>}</div>
                    </div>
                    {/* <div className="">{locker.combination}</div> */}
                    <div>Expiry: {locker.expiryDate} {locker.year}</div>
                </div>
            </CardContent>
        </Card>
    )
}