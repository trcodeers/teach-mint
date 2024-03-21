import { useEffect, useState } from 'react';
import './App.css';
import OrderCard from './components/orderCard';
import OrderTable from './components/orderTable';
import OrderForm from './components/orderForm';
import { useSnackbar } from "notistack";
import getTimeDifference from './utility/timeDiff';

function App() {
  const { enqueueSnackbar } = useSnackbar();

  const [orders, setOrders] = useState(null)
  const [totalOrders, setTotalOrders] = useState(0)

  useEffect(() => {
    updateOrdersUI()
  }, [])

  const updateOrdersUI = () =>{
    const existingOrders = localStorage.getItem('orders')
    let orderFormat = {
      placed: [],
      making: [],
      ready: [],
      picked: [],
      delivered: []
    }
    if (existingOrders) {

      const parsedOrders = JSON.parse(existingOrders)
      setTotalOrders(parsedOrders.length)

      parsedOrders.forEach(element => {
        const { status } = element

        if (status === 'placed') {
          const updatedPlacedOrders = [element, ...orderFormat.placed]
          orderFormat = {
            ...orderFormat,
            placed: updatedPlacedOrders
          }
        }
        else if (status === 'making') {
          const updatedMakingOrders = [element, ...orderFormat.making]
          orderFormat = {
            ...orderFormat,
            making: updatedMakingOrders
          }
        }
        else if (status === 'ready') {
          const updatedReadyOrders = [element, ...orderFormat.ready]
          orderFormat = {
            ...orderFormat,
            ready: updatedReadyOrders
          }
        }
        else if (status === 'picked') {
          const updatedPickedOrders = [element, ...orderFormat.picked]
          orderFormat = {
            ...orderFormat,
            picked: updatedPickedOrders
          }
        }
        else if (status === 'delivered') {
          const updatedDeliveredOrders = [element, ...orderFormat.delivered]
          orderFormat = {
            ...orderFormat,
            delivered: updatedDeliveredOrders
          }
        }
      });     
    }
    setOrders({ ...orderFormat })
  }

  const onSubmit = (data) => {
    const limitingOrders = orders ? [...orders.placed, ...orders.making] : []
    
    // IF Placed orders + making orders = 10, no more orders
    if((limitingOrders.length + 1) > 10){
      enqueueSnackbar("Not taking any order for now", {
        autoHideDuration: 1000,
        variant: "default",
        anchorOrigin: { vertical: "top", horizontal: "right" },
      });

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
    
    updateOrdersUI()

    enqueueSnackbar("Order placed", {
      autoHideDuration: 1000,
      variant: "success",
      anchorOrigin: { vertical: "top", horizontal: "right" },
    });
  };

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
    else{
      const updatedOrder = {
        ...order,
        status: 'delivered',
        pickedAt: Date.now()
      }
      updateStatus(updatedOrder, 'picked', 'delivered')
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

        {/* <div className='flex flex-col items-center'>
          <OrderForm
            onSubmit={onSubmit}
          />
        </div> */}
  
        {totalOrders > 0 &&  orders &&  <div className='flex flex-col justify-center items-start '>
          <div className='text-lg'>Pizza Stage Section</div>
          
          <div className="flex flex-row justify-center">
            
            <div className="w-60 border border-gray-500">
              <div className="text-center pb-8 font-bold">Placed</div>
              <div className="flex  flex-col items-center gap-6  pb-4">
                {
                  orders?.placed?.map((el, index) => {
                    return <OrderCard
                      key={el.placedAt}
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
                  orders?.making?.map((el, index) => {
                    return <OrderCard
                    key={el.placedAt}
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
                  orders?.ready?.map((el, index) => {
                    return <OrderCard
                    key={el.placedAt}
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
                  orders?.picked?.map((el, index) => {
                    return <OrderCard
                    key={el.placedAt}
                    order={el}
                      onClickNext={onClickNext}
                    />
                  })
                }
              </div>
            </div>

          </div>

        </div>}
        
      </div> 
    

      {/* {totalOrders === 0 && <div className='text-2xl font-bold mt-[10%]'>
        No Order placed 
      </div>}

      {totalOrders > 0 &&  orders &&
          <div class="overflow-x-auto mt-16">
              <OrderTable
                  allOrders={[...orders.placed, ...orders.making, ...orders.ready, ...orders.picked]}
                  deliveredOrdersNo={orders ? orders.delivered.length : 0}
                  onClickCancel={onClickCancel}
              />
          </div>
      } */}

    </>

  );
}

export default App;
