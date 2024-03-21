import { useForm } from "react-hook-form";
import { Pizza_Base, Pizza_Size, Pizza_Type } from "../constants.js/pizza";


const OrderForm = (props) => {

    const { onSubmit, } = props

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


    const onFormSubmit = (data) => {
        onSubmit(data)
        reset()
    }

    return (
        <form
            className="bg-white rounded mb-4 p-6"
            onSubmit={handleSubmit(onFormSubmit)}
        >
            <div className='flex flex-row gap-9'>

                <div className="flex flex-col">
                    <div className="relative inline-block text-left">
                        <label className="font-bold">Size</label>
                        <select
                            {...register("size", { required: "Required" })}
                            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        >
                            {
                                Pizza_Size.map((el, index) => {
                                    return <option key={index} value={el.value}>{el.label}</option>
                                })
                            }
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 mt-6">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M5 7l5 5 5-5z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        {errors.size && (
                            <p className="text-red-700">{errors.size.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="relative inline-block text-left">
                        <label className="font-bold">Type</label>
                        <select
                            {...register("type", { required: "Required" })}
                            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            {
                                Pizza_Type.map((el, index) => {
                                    return <option key={index} value={el.value}>{el.label}</option>
                                })
                            }
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 mt-6">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M5 7l5 5 5-5z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        {errors.type && (
                            <p className="text-red-700">{errors.type.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="relative inline-block text-left">
                        <label className="font-bold">Base</label>
                        <select
                            {...register("base", { required: "Required" })}
                            className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                            {
                                Pizza_Base.map((el, index) => {
                                    return <option key={index} value={el.value}>{el.label}</option>
                                })
                            }
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 mt-6">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M5 7l5 5 5-5z" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        {errors.base && (
                            <p className="text-red-700">{errors.base.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <button
                        className="bg-blue-500 w-full text-center text-white py-2 px-2 rounded mt-6 "
                        type="submit"
                    >
                        Create Order
                    </button>
                </div>
            </div>

        </form>
    )
}

export default OrderForm;