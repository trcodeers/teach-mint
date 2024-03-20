

const OrderCard = (props) => {
    const { order, onClickNext } = props
    const { id, type, status, base, createdAt, timeDiff } = order
    return (
        <div className={`w-44 h-36 border border-gray-300 flex flex-col justify-center text-center rounded-2xl ${timeDiff?.minutes > 3 ? 'bg-red-400' : ''}`}>
            <div>{id}</div>
            <div>{timeDiff?.minutes} min {timeDiff?.seconds} sec</div>
            {status !== 'picked' && <div> <button onClick={() => onClickNext(order)} className="bg-gray-200 px-4 py-1 mt-2 rounded-md">Next</button></div>}
        </div>
    )
}

export default OrderCard;