'use client'
import { ChangeEvent, useState, useEffect } from 'react'
import { useFetchDrinkResults } from './apiCalls'
import { DrinkData } from './types'
import Link from 'next/link'
import Image from 'next/image'
import { debounce } from './utils'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>('')

  const { data, error } = useFetchDrinkResults(searchTerm, !!searchTerm)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    debounce(setSearchTerm(e.target.value), 1000)
    typeof window !== 'undefined' && localStorage.setItem('searchTerm', e.target.value)
  }

  useEffect(() => {
    const savedSearch = localStorage.getItem('searchTerm')
    if (savedSearch) {
      setSearchTerm(savedSearch)
    }
  }, [])

  return (
    <main className='py-6'>
      <div className='px-2'>
        <input
          className='bg-gray border border-black rounded px-2 w-full'
          id='search-bar'
          onChange={(e) => handleSearch(e)}
          placeholder='Find a drink'
          type='text'
          value={searchTerm}
        />
      </div>

      {error ? (
        <div className='mt-3 px-2 text-red-900'>Something went wrong, please try again later.</div>
      ) : (
        <div className='mt-3 border-b border-b-black'>
          {data?.map((drink: DrinkData) => {
            const { idDrink, strDrink, strDrinkThumb } = drink
            return (
              <Link
                className='h-[60px] flex items-center justify-between border-t border-t-black'
                key={strDrink}
                href={`/${idDrink}`}
              >
                <div className='flex items-center'>
                  <Image
                    alt={strDrink}
                    className='rounded-full my-[10px] ml-[10px] mr-[15px]'
                    height='40'
                    src={strDrinkThumb}
                    width='40'
                  />
                  <p className='text-[17px]'>{strDrink}</p>
                </div>
                <div className='pr-3'>&gt;</div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
