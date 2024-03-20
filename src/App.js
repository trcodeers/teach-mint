import { useEffect, useState } from 'react';
import './App.css';
import OrderCard from './components/orderCard';
import OrderTable from './components/orderTable';
import OrderForm from './components/orderForm';

function App() {

  const [orders, setOrders] = useState(null)
  const [totalOrders, setTotalOrders] = useState(0)

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
      setTotalOrders(parsedOrders.length)

      parsedOrders.forEach(element => {
        const { status } = element
        const timeDiff = getTimeDifference(element.placedAt, Date.now())

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

      
    }
    setOrders({ ...orderFormat })
  }, [])

  const onSubmit = (data) => {
    const limitingOrders = orders ? [...orders.placed, ...orders.making] : []
    if(limitingOrders.length > 10){
      console.log('Not taking any order for now')
      return
    }
    const existingItems = localStorage.getItem('orders')

    
    const newOrderNo = existingItems ? (JSON.parse(existingItems).length + 1) : 1
    const newOrder = {
      id: newOrderNo,
      status: 'placed',
      placedAt: Date.now(),
      ...data
    }
    
    const existingOrders = localStorage.getItem('orders')
    const updatedOrders = [newOrder, ...(existingOrders ? JSON.parse(existingOrders) : [])]
    localStorage.setItem('orders', (JSON.stringify([...updatedOrders])))
    setTotalOrders(updatedOrders.length)
    // Set the local state
    setOrders({
      ...orders,
      placed: [ newOrder, ...(orders ? orders.placed : []) ]
    })

    // reset();
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
    const { status } = order
    if (status === 'placed') {
      
      const updatedOrder = {
        ...order,
        status: 'making',
        makingAt: Date.now()
      }

      updateStatus(updatedOrder, 'placed', 'making')

    }
    else if (status === 'making') {
      const updatedOrder = {
        ...order,
        status: 'ready',
        readyAt: Date.now()
      }
      updateStatus(updatedOrder, 'making', 'ready')
    }
    else if (status === 'ready') {
      const updatedOrder = {
        ...order,
        status: 'picked',
        pickedAt: Date.now()
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
        setTotalOrders(updatedOrders.length)
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
    
    // update local orders data -> Preventing recalculating everything
    const updatedOldOrders = orders[oldStatus].filter((el) => el.id !== updatedOrder.id) 
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

    <div className='flex flex-col items-center'>

      <div className='flex flex-col items-center'>
        <OrderForm
          onSubmit={onSubmit}
        />
      </div>
 
      {totalOrders > 0 && <div className='flex flex-col justify-center items-start '>
        <div className='text-lg'>Pizza Stage Section</div>
        <div className="flex flex-row justify-center">
          <div className="w-60 border border-gray-500">
            <div className="text-center pb-8 font-bold">Placed</div>
            <div className="flex  flex-col items-center gap-6  pb-4">
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

          <div className="w-60 border border-gray-500">
            <div className="text-center pb-8 font-bold">Making</div>
            <div className="flex  flex-col items-center gap-6 pb-4">
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

          <div className="w-60 border border-gray-500">
            <div className="text-center pb-8 font-bold">Ready</div>
            <div className="flex  flex-col items-center gap-6 pb-4">
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

          <div className="w-60 border border-gray-500">
            <div className="text-center pb-8 font-bold">Picked</div>
            <div className="flex  flex-col items-center gap-6 pb-4">
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
      </div>}

      {totalOrders > 0 && <div className='flex flex-col items-start'>
        <div className='text-lg'>Main Section</div>
        <div className="flex justify-center   mb-32"> 
          {orders && <OrderTable
            allOrders={[...orders.placed, ...orders.making, ...orders.ready, ...orders.picked]}
            deliveredOrdersNo={orders ? orders.picked.length : 0}
            onClickCancel={onClickCancel}
          />}
        </div>
      </div>}
      
      {totalOrders === 0 && <div className='text-2xl font-bold mt-[10%]'>
        No Order placed 
      </div>}
    </div>
    
    </>

  );
}

export default App;
