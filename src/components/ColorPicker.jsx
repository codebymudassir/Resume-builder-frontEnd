


import { Check, Cross, CrossIcon, Palette } from 'lucide-react';
import React, { useState } from 'react'

const ColorPicker = ({onChange,selectedColor}) => {
    const colors = [
        { name: 'blue', value: '#3B82F6' },
        { name: 'red', value: '#EF4444' },
        { name: 'orange', value: '#F97316' },
        { name: 'amber', value: '#F59E0B' },
        { name: 'yellow', value: '#EAB308' },
        { name: 'lime', value: '#84CC16' },
        { name: 'green', value: '#22C55E' },
        { name: 'emerald', value: '#10B981' },
        { name: 'teal', value: '#14B8A6' },
        { name: 'cyan', value: '#06B6D4' },
        {name:'purple',value:'#9228dd'}

    ]
    const [IsOpen,setIsOpen] = useState(false);
    return (
        <div className='relative'>
           <button onClick={()=>setIsOpen(!IsOpen)} className='flex mt-0 items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 
              hover:border-green-400 hover:bg-green-50 transition-all duration-200 shadow-sm'>
              <Palette size={16}/> <span className='max-sm:hidden'>Colors</span>
           </button>
          
          {
            IsOpen && (
                <div className='grid grid-cols-4 w-60 gap-2 absolute top-full left-0 right-0 p-3 mt-2 bg-green-100  z-10 rounded-md border shadow-md border-gray-400'>
                  {
                    colors.map((color)=>(
                        <div key={color.value} className='relative cursor-pointer group flex flex-col' onClick={()=>{onChange(color.value);setIsOpen(false)}}>
                           <div className='w-12 h-12 rounded-full border-2 border-transparent  group-hover:border-black/25 transition-colors' style={{backgroundColor:color.value}}>
                           </div>
                           {
                            selectedColor === color.value && (
                                <div className='absolute top-0 right-0 left-0 flex items-center bottom-4.5 justify-center'>
                                  <Check className='size-5 text-white'/>
                                </div>
                            )
                           }
                           <p className='text-xs text-center mt-1 text-gray-500'>{color.name}</p>
                        </div>   
                    ))
                  }
                </div>
            )
          }
        </div>
    )
}

export default ColorPicker