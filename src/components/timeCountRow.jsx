import { useEffect, useState } from "react"
import getTimeDifference from "../utility/timeDiff"


const TimeCountRow = (props) => {
    const { order } = props
    const [timeDiffMessage, setTimeDiffMessage] = useState(null)

    useEffect(() => {
        const intervalId = setInterval(() => {
            const { minutes, seconds } = getTimeDifference(order.placedAt, Date.now())
            setTimeDiffMessage({ minutes, seconds })
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup on component unmount    
    }, [])


    return (
        <>
            {timeDiffMessage && <div>{timeDiffMessage?.minutes} min {timeDiffMessage?.seconds} sec</div>}
        </>
    )

}

export default TimeCountRow