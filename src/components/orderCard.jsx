import { useEffect, useState } from "react"


const OrderCard = (props) => {
    const { order, onClickNext } = props
    const { id, status } = order
    const [timeDiffMessage, setTimeDiffMessage] = useState(null)

    useEffect(() => {
        const intervalId = setInterval(() => {
            const { minutes, seconds } = getTimeDifference(order[`${status}At`], Date.now())
            setTimeDiffMessage({ minutes, seconds })
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup on component unmount    
    }, [])

    function getTimeDifference(startTimeStamp, endTimeStamp) {
        // Convert timestamps to milliseconds
        const startTime = new Date(startTimeStamp).getTime();
        const endTime = new Date(endTimeStamp).getTime();

        // Calculate the difference in milliseconds
        let timeDifference = endTime - startTime;

        // Calculate minutes and seconds
        const minutes = Math.floor(timeDifference / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        return { minutes, seconds };
    }

    return (
        <div className={`w-max-44 px-8 h-36 border border-gray-500 flex flex-col justify-center text-center rounded-2xl ${timeDiffMessage?.minutes >= 3 ? 'bg-red-400' : ''}`}>
            <div>{id}</div>
            {timeDiffMessage && <div>{timeDiffMessage?.minutes} min {timeDiffMessage?.seconds} sec</div>}
            <div>
                <button onClick={() => onClickNext(order)} className="bg-gray-200 px-4 py-1 mt-2 rounded-md border border-gray-500">
                    {status === 'picked' ? 'Picked' : 'Next'}
                </button>
            </div>
        </div>
    )
}

export default OrderCard;