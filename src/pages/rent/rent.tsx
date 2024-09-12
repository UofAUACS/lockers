import { auth } from "@/firebase";
import { Locker } from "@/types";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { useEffect, useState } from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  
export default function Rent() {
    const [user, setUser] = useState<User | null>()
    const [availableLockers, setAvailableLockers] = useState<Locker[] | undefined>([])
    const [searchLocker, setSearchLocker] = useState<string>("")
    const handleAuth = async () => {
        // check platform
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        // @ts-ignore
        setUser(result.user);
      }
    const handleLogout = async () => {
        await auth.signOut();
        setUser(null);
    }
    const handleSearch = (e: any) => {
        e.preventDefault();
        setSearchLocker(e.target.value);
      };
    useEffect(() => {
        
        const getData = async () => {
            const token = await user?.getIdToken()
            const res = await axios.get("https://services.uacs.ca/lockers/get-available-lockers", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setAvailableLockers(res.data.lockers)
        }
        
        getData()
    }, [user])
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setUser(user)
        })
    },[])
    return (
        <div className="  w-screen flex justify-center mt-1 p-1">
            <div className="max-w-[320px] md:max-w-[700px] flex flex-col justify-center md:w-[650px] text-left mt-10 w-full ">
                <div className="text-3xl font-semibold">Available Lockers</div>
                {!user && <div>
                    Sign in to see avaliable lockers.
                    <button onClick={handleAuth} className="border">Sign in with Google</button>
                    <div>Use desktop to sign in. Mobile sign in not yet supported.</div>
                    </div>}
                {user && <div className="mt-4 font-light">
                    Welcome {user.displayName}! <span>Not you? <span className="text-blue-400 hover:cursor-pointer" onClick={handleLogout}>Sign out</span></span>
                    <div>Here are the available lockers:</div>
                    <input type="text" placeholder="Search for a locker" className="border rounded-md p-2 mt-3" onChange={handleSearch} value={searchLocker}/>
                    </div>}
                {user && !user.email?.includes("@ualberta.ca") && <div className="mt-3 text-red-500">Please use your UAlberta email to rent a locker</div>}
                {user && <div className="mt-3 flex flex-col space-y-3">
                    {availableLockers?.filter((locker) => {
                        if (searchLocker.length > 0) {
                            return locker.lockerNumber.toString().includes(searchLocker)
                        } else {
                            return true
                        }
                    }).map((locker) => {
                        return <LockerCard key={locker.lockerNumber} lockerNumber = {locker.lockerNumber} user={user}/>
                    })}
                    </div>}
            </div>
        </div>
    )
}

const LockerCard = ({lockerNumber, user}: {lockerNumber: number, user:User}) => {
    const [expiry, setExpiry] = useState<string>("F2024")
    const [transactionNumber, setTransactionNumber] = useState<string>("")
    const [missing, setMissing] = useState<boolean>(false)
    const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExpiry(e.target.value)
    }
    const handleTransactionNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTransactionNumber(e.target.value)
    }

    const onSubmit = async () => {
        if (!transactionNumber) {
            setMissing(true)
            return
        }
        const token = await user.getIdToken()
        const expiryMonth = expiry === "F2024" ? "Jan" : "May"
        const expiryYear = 2025
        await axios.post("https://services.uacs.ca/lockers/order-rent-locker", {
            "locker_id": lockerNumber,
            "expiry": expiryMonth,
            "year": expiryYear,
            "transaction_id" : transactionNumber
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
    return (
        <div className="border rounded-md p-3 flex justify-between items-center">
            <div className="ml-3">Locker {lockerNumber}</div>
            <Drawer>
                <DrawerTrigger className="bg-blue-300">Rent</DrawerTrigger>
                <DrawerContent className="flex flex-col justify-center items-center">
                    <DrawerHeader>
                    <DrawerTitle className="mb-3">Your details</DrawerTitle>
                    <div>
                        <div>Locker {lockerNumber}</div>
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
                        <button className  ="bg-green-200 w-36" onClick={onSubmit}>Send Request</button>
                        </div>
                            
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}