
const OrderTable = (props) => {

    const { allOrders, deliveredOrdersNo, onClickCancel } = props


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

    const getTimeDiffMessage = (startTime) =>{
        const { minutes, seconds } = getTimeDifference(startTime, Date.now())
        return `${minutes} min ${seconds} sec`
    }

    return (
        <table className="table-auto w-[70%] border border-collapse">

            <thead>
                <tr>
                    <th className="px-4 py-2 border">Order id</th>
                    <th className="px-4 py-2 border">Stage</th>
                    <th className="px-4 py-2 border">Times Spent</th>
                    <th className="px-4 py-2 border">Action</th>
                </tr>
            </thead>

            <tbody className='mb-20'>

                {allOrders && allOrders.map((el) => {
                    return <tr>
                        <td className="px-4 py-2 border text-center">{el.id}</td>
                        <td className="px-4 py-2 border text-center">{el.status}</td>
                        <td className="px-4 py-2 border text-center">{getTimeDiffMessage(el[`${el.status}At`])} sec</td>
                        <td className="px-4 py-2 border text-center">
                            {(el.status !== 'ready' && el.status !== 'picked') && <button onClick={() => onClickCancel(el)} className="bg-red-600 hover:bg-red-500 text-white py-1 px-3 rounded inline-flex items-center">
                                Cancel
                            </button>
                            }
                        </td>
                    </tr>
                })}

            </tbody>

            <tfoot>
                <tr>
                    <td colspan="1" className="px-4 py-2 border font-bold text-end">
                        Total order delivered
                    </td>
                    <td colspan="2" className="px-4 py-2 border font-bold">
                        {deliveredOrdersNo}
                    </td>
                </tr>
            </tfoot>

        </table>
    )
}

export default OrderTable;