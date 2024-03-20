

const OrderCard = (props) => {
    const { order: { id, type, status, base, createdAt, timeDiff } } = props
    console.log(props)

    return (
        <div className={`w-44 h-36 border border-gray-300 flex flex-col justify-center text-center rounded-2xl ${timeDiff?.minutes > 3 ? 'bg-red-400' : ''}`}>
            <div>{id}</div>
            <div>{timeDiff?.minutes} min {timeDiff?.seconds} sec</div>
            <div> <button className="bg-gray-200 px-4 py-1 mt-2 rounded-md">Next</button></div>
        </div>
    )
}

export default OrderCard;