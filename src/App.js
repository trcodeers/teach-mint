import { useEffect, useState } from 'react';
import './App.css';
import { useForm } from "react-hook-form";

function App() {

  const [orders, setOrders] = useState(null)

  useEffect(()=>{
    const existingOrders = localStorage.getItem('orders')
let orderFormat = {
  placed: [],
  making: [],
  ready: [],
  picked: []
}
    if(existingOrders){

      const parsedOrders = JSON.parse(existingOrders)
      
      parsedOrders.forEach(element => {
        const { status } = element
        if(status === 'placed'){
          const updatedPlacedOrders = [ element, ...orderFormat.placed]
          orderFormat = {
            ...orderFormat,
            placed: updatedPlacedOrders
          }
        }
        else if(status === 'making'){
          const updatedMakingOrders = [ element, ...orderFormat.making]
          orderFormat = {
            ...orderFormat,
            making: updatedMakingOrders
          }
        }
        else if(status === 'ready'){
          const updatedReadyOrders = [ element, ...orderFormat.ready]
          orderFormat = {
            ...orderFormat,
            ready: updatedReadyOrders
          }
        }
        else if(status === 'picked'){
          const updatedPickedOrders = [ element, ...orderFormat.picked]
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
    const newOrder = {
      id: (orders.length + 1),
      status: 'placed',
      createdAt: Date.now(),
      ...data
    }
    const updatedOrders = [ newOrder, ...orders ]
    localStorage.setItem('orders',(JSON.stringify([ ...updatedOrders ])))
    setOrders([ ...updatedOrders ])
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

  return (
    <>
      <div>
        {/* <form
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
                className="bg-red-500 w-[80px] text-center text-white py-2 px-2 rounded "
                type="submit"
              >
                Save
              </button>
            </div>

          </div>
          


      
        </form> */}
      </div>
    
        <div>
        <div class="flex flex-row gap-9">
  
  <div class="w-40">
    <div class="text-center">PLaced</div>
    <div class="flex flex-col gap-6">
      <div class="w-44 h-36 bg-black text-white flex flex-col justify-center text-center rounded-2xl">
        <div>Order 1</div>
        <div>3 min 10 sec</div>
        <div> <button>Next</button></div>
      </div>
        <div class="w-44 h-36 bg-black text-white flex flex-col justify-center text-center">
        <div>Order 1</div>
        <div>3 min 10 sec</div>
        <div> <button>Next</button></div>
      </div>
    </div>

  </div>
  

    <div class="w-40">
      <div class="text-center">Making</div>
    <div class="w-44 h-36 bg-black text-white flex flex-col justify-center text-center">
      <div>Order 1</div>
      <div>3 min 10 sec</div>
      <div> <button>Next</button></div>
    </div> 
  </div>
    <div class="w-40">
      <div>Ready</div>
    <div class="w-44 h-36 bg-black text-white flex flex-col justify-center text-center">
      <div class="text-center">Order 1</div>
      <div>3 min 10 sec</div>
      <div> <button>Next</button></div>
    </div> 
  </div>
    <div class="w-40">
      <div class="text-center">Picked</div>
    <div class="w-44 h-36 bg-black text-white flex flex-col justify-center text-center">
      <div>Order 1</div>
      <div>3 min 10 sec</div>
      <div> <button>Next</button></div>
    </div> 
  </div>
</div>



        </div>
    </>

  );
}

export default App;
