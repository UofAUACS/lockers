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

  import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
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
                    {lockers.map((locker: any) => {return <LockerCard locker={locker} key={uuid_v4()} user={user!}/>})}
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

const LockerCard = ({ locker, user }: {locker: Locker, user:User}) => {
    const [combinationHidden, setCombinationHidden] = useState(true)
    const [expiry, setExpiry] = useState<string>("F2024")
    const [transactionNumber, setTransactionNumber] = useState<string>("")
    const [missing, setMissing] = useState<boolean>(false)

    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)

    const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExpiry(e.target.value)
    }
    const handleTransactionNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTransactionNumber(e.target.value)
    }

    const handleSuccess = () => {
        setSuccess(true)
        setTimeout(() => {
            setSuccess(false)
        }, 5000)
    }

    const handleError = () => {
        setError(true)
        setTimeout(() => {
            setError(false)
        }, 5000)
    }

    const onSubmit = async () => {
        if (!transactionNumber) {
            setMissing(true)
            return
        }
        const token = await user.getIdToken()
        const expiryMonth = expiry === "F2024" ? "Jan" : "May"
        const expiryYear = 2025
        try {
            await axiosInstance.post(`/lockers/renew-locker?locker_number=${locker.lockerNumber}`, {
                "expiry": expiryMonth,
                "year": expiryYear,
                "transaction_id" : transactionNumber
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            handleSuccess()
        } catch (error) {
            handleError()
        }
    }
    return (
        <Card className="w-40 m-3">
            {error && <div className="fixed top-0 left-0 bg-red-200 m-2 p-2 rounded-md slide-in-x">Error Occured! Refresh and try again.</div>}
            {success && <div className="fixed top-0 left-0 bg-green-200 m-2 p-2 rounded-md slide-in-x">Request Successful!</div>}
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
                    <Drawer>
                        <DrawerTrigger className=" border bg-green-100">Renew</DrawerTrigger>
                        <DrawerContent className="flex flex-col justify-center items-center">
                            <DrawerHeader>
                            <DrawerTitle className="mb-3">Your details</DrawerTitle>
                            <div>
                                <div>Locker {locker.lockerNumber}</div>
                            </div>
                            <div>
                                <div className="text-sm font-light text-left ">Email:</div>
                                {user.email && <input type="text" value={user.email} disabled className="w-full border rounded-sm p-2 text-sm" />}
                            </div>
                            <div className="mt-2 text-left">
                                <input type="radio" value="F2024" id="regular" className="" checked={expiry === "F2024"} onChange={handleExpiry}/>
                                <label htmlFor="regular" className="ml-2">Fall 2024</label>
                                <br/>
                                <input type="radio" value="FW2025" id="medium" checked={expiry === "FW2025"} onChange={handleExpiry}/>
                                <label htmlFor="medium" className="ml-2">Fall 2024 + Winter 2025</label>

                            </div>
                            <div className="mt-2 text-left">
                            <div className="text-sm font-light w-3/4">Please interact the required amount on execs@uacs.ca | $10 per semester + $5 deposit</div>
                            <input type="text" placeholder="Interact Transaction Number" className="w-full border rounded-sm p-2 text-sm mt-2" onChange={handleTransactionNumber} value={transactionNumber} />
                            </div>
                            <div className="mt-3 text-sm font-light text-left">You will recieve an email once your request is approved!</div>
                            {missing && <div className="text-red-300 text-sm italic">*Trasaction number required.</div>}
                            </DrawerHeader>
                            <DrawerFooter>
                                <div className="flex space-x-4">
                                <DrawerClose className="bg-red-100 w-36">Cancel</DrawerClose>
                                {!transactionNumber && <button className  ="bg-green-200 w-36" onClick={() => setMissing(true)}>Send Request</button>}
                                {transactionNumber && <DrawerClose className  ="bg-green-200 w-36" onClick={onSubmit}>Send Request</DrawerClose>}
                                </div>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                </div>
            </CardContent>
        </Card>
    )
}