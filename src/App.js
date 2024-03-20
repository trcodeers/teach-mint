import { useEffect, useState } from 'react';
import './App.css';
import { useForm } from "react-hook-form";
import OrderCard from './components/orderCard';

function App() {

  const [orders, setOrders] = useState(null)

  useEffect(() => {
    const existingOrders = localStorage.getItem('orders')
    let orderFormat = {
      placed: [],
      making: [],
      ready: [],
      picked: []
    }
    if (existingOrders) {

      const parsedOrders = JSON.parse(existingOrders)

      parsedOrders.forEach(element => {
        const { status } = element
        const timeDiff = getTimeDifference(element.createdAt, Date.now())

        console.log(timeDiff)
        const updatedElement = { ...element, timeDiff }
        console.log(updatedElement)
        if (status === 'placed') {
          const updatedPlacedOrders = [updatedElement, ...orderFormat.placed]
          orderFormat = {
            ...orderFormat,
            placed: updatedPlacedOrders
          }
        }
        else if (status === 'making') {
          const updatedMakingOrders = [updatedElement, ...orderFormat.making]
          orderFormat = {
            ...orderFormat,
            making: updatedMakingOrders
          }
        }
        else if (status === 'ready') {
          const updatedReadyOrders = [updatedElement, ...orderFormat.ready]
          orderFormat = {
            ...orderFormat,
            ready: updatedReadyOrders
          }
        }
        else if (status === 'picked') {
          const updatedPickedOrders = [updatedElement, ...orderFormat.picked]
          orderFormat = {
            ...orderFormat,
            picked: updatedPickedOrders
          }
        }
      });

      setOrders({ ...orderFormat })

    }
  }, [])


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "",
      size: "",
      base: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data)
    const existingOrders = JSON.parse(localStorage.getItem('orders'))
    const newOrder = {
      id: ((existingOrders ? existingOrders.length : 0) + 1),
      status: 'placed',
      createdAt: Date.now(),
      ...data
    }
    const updatedOrders = [newOrder, ...(existingOrders ? existingOrders : [])]
    localStorage.setItem('orders', (JSON.stringify([...updatedOrders])))

    reset();
  };

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

  const onClickNext = (order) => {
    console.log(order)
    const { status } = order
    if (status === 'placed') {
      
      const updatedOrder = {
        ...order,
        status: 'making'
      }

      updateStatus(updatedOrder, 'placed', 'making')

    }
    else if (status === 'making') {
      const updatedOrder = {
        ...order,
        status: 'ready'
      }
      updateStatus(updatedOrder, 'making', 'ready')
    }
    else if (status === 'ready') {
      const updatedOrder = {
        ...order,
        status: 'picked'
      }
      updateStatus(updatedOrder, 'ready', 'picked')

    }
 
  }

  const onClickCancel = (order) => {
    if(order.status !== 'ready' && order.status !== 'picked'){
      // Remove from local storage
        const existingOrders = JSON.parse(localStorage.getItem('orders'))
        const updatedOrders = existingOrders.filter((el) => el.id !== order.id)
        localStorage.setItem('orders', JSON.stringify(updatedOrders))

      // Remove from local state 
      if(order.status === 'placed'){
        
        const updatedPlacedOrder = orders.placed.filter((el) => el.id !== order.id)
        setOrders({
          ...orders,
          placed: updatedPlacedOrder
        })

      } 

      else if(order.status === 'making'){
        
        const updatedMakingOrder = orders.making.filter((el) => el.id !== order.id)
        setOrders({
          ...orders,
          making: updatedMakingOrder
        })
      
      }
    }
  }

  const updateStatus = (updatedOrder, oldStatus, newStatus) =>{
    
    // update localstorage
    const storedOrdered = JSON.parse(localStorage.getItem('orders'))
    const orderIndex = storedOrdered.findIndex((el) => el.id === updatedOrder.id)
    storedOrdered[orderIndex] = updatedOrder
    localStorage.setItem('orders', JSON.stringify(storedOrdered)) 
    
    // // update local orders data -> Preventing recalculating everything
    const updatedOldOrders = orders[oldStatus].filter((el) => el.id !== updatedOrder.id) 
    console.log('updaed', updatedOldOrders)
    const updatedNewOrders = [ updatedOrder, ...orders[newStatus] ]
    setOrders((prev) => {
      return {
        ...prev,
        [oldStatus]: updatedOldOrders,
        [newStatus]: updatedNewOrders
      }
    })


  }

  return (
    <>
      <div className='flex justify-center'>
        <form
          className="bg-white rounded mb-4 p-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='flex flex-row gap-9'>

            <div className="relative inline-block text-left">
              <label>Size</label>
              <select
                {...register("size", { required: "Title is required" })}
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value='small'>Small</option>
                <option value='medium'>Medium</option>
                <option value='large'>Large</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5 7l5 5 5-5z" />
                </svg>
              </div>
            </div>

            <div className="relative inline-block text-left">
              <label>Type</label>
              <select
                {...register("type", { required: "Title is required" })}
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option value='veg'>Veg</option>
                <option value='non-veg'>Non Veg</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5 7l5 5 5-5z" />
                </svg>
              </div>
            </div>

            <div className="relative inline-block text-left">
              <label>Base</label>
              <select
                {...register("base", { required: "Title is required" })}
                className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                <option value='thick'>Thick</option>
                <option value='thin'>Thin</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5 7l5 5 5-5z" />
                </svg>
              </div>
            </div>

            <div>
              <button
                className="bg-red-500 w-[100px] text-center text-white py-2 px-2 rounded "
                type="submit"
              >
                Create
              </button>
            </div>
          </div>

        </form>
      </div>

      <div>
        <div className="flex flex-row gap-9 justify-center">
          <div className="w-40">
            <div className="text-center pb-8 font-bold">Placed</div>
            <div className="flex flex-col gap-6">
              {
                orders?.placed?.map((el) => {
                  return <OrderCard
                    order={el}
                    onClickNext={onClickNext}
                  />
                })
              }
            </div>

          </div>

          <div className="w-40">
            <div className="text-center pb-8 font-bold">Making</div>
            <div className="flex flex-col gap-6">
              {
                orders?.making?.map((el) => {
                  return <OrderCard
                    order={el}
                    onClickNext={onClickNext}
                  />
                })
              }
            </div>
          </div>

          <div className="w-40">
            <div className="text-center pb-8 font-bold">Ready</div>
            <div className="flex flex-col gap-6">
              {
                orders?.ready?.map((el) => {
                  return <OrderCard
                    order={el}
                    onClickNext={onClickNext}
                  />
                })
              }
            </div>
          </div>

          <div className="w-40">
            <div className="text-center pb-8 font-bold">Picked</div>
            <div className="flex flex-col gap-6">
              {
                orders?.picked?.map((el) => {
                  return <OrderCard
                    order={el}
                    onClickNext={onClickNext}
                  />
                })
              }
            </div>
          </div>
        </div>



      </div>

      <div>
        <div className="overflow-x-auto flex justify-center mt-32 mb-32">
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

              {orders && [...orders.placed, ...orders.making, ...orders.ready, ...orders.picked].map((el) => {
                return <tr>
                  <td className="px-4 py-2 border text-center">{el.id}</td>
                  <td className="px-4 py-2 border text-center">{el.status}</td>
                  <td className="px-4 py-2 border text-center">{el.timeDiff.minutes} min {el.timeDiff.seconds} sec</td>
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
                <td colspan="1" className="px-4 py-2 border font-bold">
                  Total order delivered
                </td>
                <td colspan="2" className="px-4 py-2 border font-bold">
                  {orders && orders.picked.length}
                </td>
              </tr>
            </tfoot>

          </table>
        </div>
      </div>

    </>

  );
}

export default App;
