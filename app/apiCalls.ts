import useSWR from 'swr'
import { useParams } from 'next/navigation'
import { DrinkData } from './types'

const fetcher = async (url: string) => {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Something went wrong, please try again later.')
    }

    return response.json()
  }

export const useFetchDrinkResults = (searchTerm: string, shouldFetch: boolean): { data: DrinkData[], error: any } => {
    const { data, error } = useSWR(() => shouldFetch ? `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}` : null, fetcher)

    return { data: data?.drinks, error }
}

export const useFetchOneDrink = (): { data: DrinkData, error: any, isLoading: boolean } => {
    const params = useParams()
    const { data, error, isLoading } = useSWR(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${params.drinkId}`, fetcher)

    return { data: data?.drinks[0], error, isLoading }
}
