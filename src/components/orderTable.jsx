import getTimeDifference from "../utility/timeDiff"

const OrderTable = (props) => {

    const { allOrders, deliveredOrdersNo, onClickCancel } = props

    const getTimeDiffMessage = (startTime) =>{
        const { minutes, seconds } = getTimeDifference(startTime, Date.now())
        return `${minutes} min ${seconds} sec`
    }

    return (
        <table className="table-auto min-w-full border border-collapse">

            <thead>
                <tr>
                    <th className="px-4 py-2 border">Order id</th>
                    <th className="px-4 py-2 border">Stage</th>
                    <th className="px-4 py-2 border">Total Time Spent</th>
                    <th className="px-4 py-2 border">Action</th>
                </tr>
            </thead>

            <tbody className='mb-20'>

                {allOrders && allOrders.map((el, index) => {
                    return <tr key={index}>
                        <td className="px-4 py-2 border text-center">{el.id}</td>
                        <td className="px-4 py-2 border text-center">{el.status}</td>
                        <td className="px-4 py-2 border text-center">{getTimeDiffMessage(el.placedAt)}</td>
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
                    <td colSpan="1" className="px-4 py-2 border font-bold text-end">
                        Total order delivered
                    </td>
                    <td colSpan="2" className="px-4 py-2 border font-bold">
                        {deliveredOrdersNo}
                    </td>
                </tr>
            </tfoot>

        </table>
    )
}

export default OrderTable;