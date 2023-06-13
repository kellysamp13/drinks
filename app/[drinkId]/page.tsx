'use client'
import { useState, useEffect } from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import Image from 'next/image'
import { useFetchOneDrink } from '../apiCalls'
import { FormattedIngredientData } from '../types'
import { formatIngredientData, getFilteredIngredientData } from '../utils'

export default function Drinks() {
    const [ingredientData, setIngredientData] = useState<FormattedIngredientData[]>([])
    const { data, isLoading, error } = useFetchOneDrink()

    useEffect(() => {
      if (data) {
        const mappedData = formatIngredientData(data)
        // set to state so both the ingredient section and pie chart have access
        return setIngredientData(mappedData)
      }
    }, [data])

    if (error) {
      return <div className='mt-3 px-2 text-red-900'>Something went wrong, please try again later.</div>
    }

    return (
      <main className='px-[20px] pb-[30px]'>
        {/* skeleton is shown during loading */}
        {isLoading ? (
          <>
            <div className='bg-slate-300 rounded-full mt-[30px] h-[150px] w-[150px] m-auto' />
            <div className='bg-slate-300 h-[30px] mt-[20px]' />
            <div className='bg-slate-300 h-[30px] mt-[20px]' />

            <div className='bg-slate-300 h-[30px] mt-[20px]' />
          </>
        ): (
          <>
            <Image
              alt={data.strDrink}
              className='rounded-full mt-[30px] m-auto'
              height={150}
              src={data.strDrinkThumb}
              width={150}
            />
            <p className='text-[20px] font-bold mt-[20px] text-center'>{data.strDrink}</p>

            <p className='mt-[20px] mb-[30px] font-bold text-[17px]'>Ingredients:</p>

            <div className='flex items-start justify-between'>
              <div>
                {ingredientData.map((ingredient: FormattedIngredientData) => {
                  const { color, title } = ingredient
                  return  (
                    <div className='flex' key={title}>
                      <div
                        className='h-[20px] w-[20px] rounded mr-2 shrink-0'
                        style={{ backgroundColor: color }}
                      />
                      {title}
                    </div>
                  )
                })}
              </div>

              <div className='w-[120px] ml-[20px]'>
                <PieChart
                  data={getFilteredIngredientData(ingredientData)}
                />
              </div>
            </div>

            <p className='mt-[30px] text-[17px]'>{data.strInstructions}</p>
          </>
        )}
      </main>
    )
  }
