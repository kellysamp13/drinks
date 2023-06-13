import convert, { Unit } from 'convert-units'
import { FormattedIngredientData } from './types'

export const debounce = (fn: any, timeout: number = 1000) => {
    let timer: ReturnType<typeof setTimeout>

    return function (this: any, ...args: any[]) {
        clearTimeout(timer)
        timer = setTimeout(() => fn.apply(this, args), timeout)
    }
}

export const generateRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let hexValue = '#'
    for (var i = 0; i < 6; i++) {
        hexValue += letters[Math.floor(Math.random() * 16)];
    }
    return hexValue
}

export const formatIngredientData = (data = {}) => {
    // pull out relevant ingredient and measurement data
    // we could have 1-15 ingredients, 0-15 measurements
    const drinkArray: [string, string | null][] = Object.entries(data)
    const ingredients: (string | null)[] = drinkArray.filter(([key, value]) => key.startsWith('strIngredient') && value)
    .map(ingredient => ingredient[1])

    const measurements: (string | undefined)[] = drinkArray.filter(([key, value]) => key.startsWith('strMeasure') && value).map((measurement: [string, string | null]) => measurement[1]?.trim())

    // reformat to include only info the ui cares about
    return ingredients.map((ingredient: string | null, i: number) => {
        return {
        color: generateRandomColor(),
        measurement: measurements[i],
        title: `${ingredient}${measurements[i] ? ` (${measurements[i]})` : ''}`,
        value: null,
        }
    })
}

export const formatMeasurementString = (measurementString: string | Unit) => {
    if (measurementString === 'oz') {
      return 'fl-oz'
    }
    if (measurementString === 'tblsp') {
      return 'Tbs'
    }
    if (measurementString === 'cups') {
        return 'cup'
      }
    return measurementString
  }

// any type left here because of PieChart component
export const getFilteredIngredientData = (ingredientData: FormattedIngredientData[]): any[] => {
    // pulling out ingredients with liquid measurements than can be compared
    const validUnits = ['tblsp', 'tsp', 'cup', 'cups', 'oz', 'ml', 'cl']
    const validIngredients: FormattedIngredientData[] = ingredientData.filter((ingredient: FormattedIngredientData) => {
      return validUnits.some(unit => ingredient.measurement?.includes(unit))
    })

    validIngredients.forEach((ingredient: FormattedIngredientData) => {
      if (!ingredient.measurement) return

      // ensure all numbers are decimals
      // convert api measurements to a string accepted by 'convert-units'
      const splitMeasurement: string[] = ingredient.measurement?.split(' ')
      let num: number
      let measurement: Unit
      if (splitMeasurement[1].indexOf('/') >= 0) {
        let firstNum = eval(splitMeasurement[0])
        let secondNum = eval(splitMeasurement[1])
        num = firstNum + secondNum
        measurement = formatMeasurementString(splitMeasurement[2]) as Unit
      } else {
        num = eval(splitMeasurement[0])
        measurement = formatMeasurementString(splitMeasurement[1]) as Unit
      }

      ingredient.value = convert(num).from(measurement).to('Tbs')
    })

    return validIngredients
  }
