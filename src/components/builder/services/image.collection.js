import {
  getImageCollections,
  getImageCollectionNames,
} from 'src/services/api.service'

export const fetchImageCollections = async () => {
  try {
    let response = await getImageCollectionNames()
    const names = response.data?.items

    response = await getImageCollections()
    const collections = response.data.items

    return { names, collections }
  } catch (error) {
    console.log(error)
  }
}
