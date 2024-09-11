import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate()
    return (
        <div className="  w-screen flex justify-center md:mt-5 p-2">
            <div className="max-w-[320px] md:max-w-[700px] flex flex-col justify-center md:w-[650px] text-left mt-10 w-full ">
                <div className="text-3xl font-semibold">CSC Locker Rentals</div>
                <img src="image.jpg" alt="image" className="w-full h-[250px] object-cover mt-5 rounded-sm" />
                <div className="mt-3 text-md font-light">Locker rentals are available per semester for Fall, Winter and Summer, with the option to choose two-semester rentals for rentals that begin in the Fall semester or Winter semesters.</div>
                <div className="text-2xl font-semibold mt-4">Rental Fees</div>
                <div className="mt-3 font-light">$10 per semester + $5 one time deposit which will be returned.</div>
                <div className="text-2xl font-semibold mt-4">Note</div>
                <div className="font-light mt-3">Please remember to clean out your locker by the end of the term.</div>
                <div className="font-light mt-1">UACS is not responsible for damage to, or theft of, contents of lockers. UACS will dispose of contents left within 14 days of the end of an academic semester based on the length of the locker rental.</div>
                <div className="flex space-x-5 mt-3 self-center">
                    <button className=" border border-sky-500 hover:bg-blue-100" onClick={() => navigate("/rent-locker")}>Rent a Locker</button>
                    <button className="border border-sky-500 hover:bg-blue-100" onClick={() => navigate("/my-lockers")}>Your Locker</button>
                </div>
                <div className="mt-5 text-2xl">Where to Find the lockers?</div>
                <div className="mt-3 font-light">Here is a map of ground floor CSC.</div>
                <img src="/location.jpg" alt="location" className="w-full object-fit mt-5 rounded-sm" />
            </div>
        </div>
    )
}