

const OrderCard = (props) => {
    const { order: { id, type, status, base, createdAt, timeDiff } } = props
    console.log(props)
    return (
        <div class="w-44 h-36 border border-gray-300 flex flex-col justify-center text-center rounded-2xl">
            <div>{id}</div>
            <div>{timeDiff?.minutes} min {timeDiff?.seconds} sec</div>
            <div> <button>Next</button></div>
        </div>
    )
}

export default OrderCard;