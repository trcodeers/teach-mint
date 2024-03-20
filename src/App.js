import { useEffect, useState } from 'react';
import './App.css';
import OrderCard from './components/orderCard';
import OrderTable from './components/orderTable';
import OrderForm from './components/orderForm';

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
        <OrderForm
          onSubmit={onSubmit}
        />
      </div>

    
      <div className="flex flex-row justify-center">
        
        <div className="w-60 border border-gray-500">
          <div className="text-center pb-8 font-bold">Placed</div>
          <div className="flex  flex-col items-center gap-6">
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
          <div className="flex  flex-col items-center gap-6">
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
          <div className="flex  flex-col items-center gap-6">
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
          <div className="flex  flex-col items-center gap-6">
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

      <div>
        <div className="overflow-x-auto flex justify-center mt-32 mb-32"> 
          {orders && <OrderTable
            allOrders={[...orders.placed, ...orders.making, ...orders.ready, ...orders.picked]}
            deliveredOrdersNo={orders ? orders.picked.length : 0}
            onClickCancel={onClickCancel}
          />}
        </div>
      </div>

    </>

  );
}

export default App;
