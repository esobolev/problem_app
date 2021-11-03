import { useEffect, useState } from 'react'
import { Select } from 'src/components/select'
// import { collections, colors } from './constants'
import {
  getImageCollections,
  getUserImages,
  uploadUserImages,
} from 'src/services/api.service'

const ShapesMenu = ({ active = false, onClick = () => {} }) => {
  const [tab, setTab] = useState('regular')
  const [themes, setThemes] = useState([])
  const [collectionName, setCollectionName] = useState('')

  const [userImages, setUserImages] = useState([])

  useEffect(() => {
    const fetch = async () => {
      try {
        let response = await getImageCollections()
        setThemes(response.data?.items)

        if ((Object.keys(response.data?.items) || []).length > 0) {
          setCollectionName(Object.keys(response.data?.items)[0])
        }

        response = await getUserImages()
        setUserImages(response.data?.items)
      } catch (error) {
        console.log(error)
      }
    }

    fetch()
  }, [])

  const handleClick =
    (name, modification = 'regular') =>
    (e) => {
      e.preventDefault()
      onClick(name, modification)
    }

  const handleCollectionChange = (value) => {
    setCollectionName(value)
  }

  const handleMultiSelectFile = async (event) => {
    const files = [...event.target.files]
    const loadedFiles = []

    console.log('files', files)

    await Promise.all(
      files.map(
        async (file) =>
          new Promise((resolve) => {
            const reader = new FileReader()
            reader.onloadend = function (e) {
              loadedFiles.push(e.target.result)
              resolve()
            }

            // Read the image
            reader.readAsDataURL(file)
          }),
      ),
    )

    console.log('loadedFiles', loadedFiles, userImages)
    const result = await uploadUserImages({ images: loadedFiles })
    setUserImages([...userImages, ...result.data.items])
  }

  const collection = themes[collectionName]
  let prefixUrl = null

  if (collection) {
    prefixUrl = `${process.env.REACT_APP_S3_HOST}/image_collection`
  }

  console.log('collection', prefixUrl, collection)

  return (
    <div
      className="pattern-shapes"
      style={{ display: active ? 'block' : 'none' }}
    >
      <div className="shape-tabs">
        <div
          className={`tab ${tab === 'regular' ? 'active' : ''}`}
          onClick={() => {
            setTab('regular')
          }}
        >
          Regular
        </div>
        <div
          className={`tab ${tab === 'large' ? 'active' : ''}`}
          onClick={() => {
            setTab('large')
          }}
        >
          Large
        </div>
        <div
          className={`tab ${tab === 'custom' ? 'active' : ''}`}
          onClick={() => {
            setTab('custom')
          }}
        >
          Custom
        </div>
      </div>

      <div
        className="pattern-content"
        style={{
          display: tab === 'regular' || tab === 'large' ? 'block' : 'none',
        }}
      >
        <Select
          placeholder="Collection"
          value={collectionName}
          onChange={(item) => {
            handleCollectionChange(item.value)
          }}
          options={(Object.keys(themes) || []).map((x) => ({
            label: x,
            value: x,
          }))}
        />

        <div className="line" style={{ marginTop: 10 }}>
          {prefixUrl &&
            collection &&
            (Object.values(collection) || []).map((idx) => (
              <a
                className={tab === 'large' ? 'large' : ''}
                key={`${idx}`}
                onClick={handleClick(
                  `${prefixUrl}/${collectionName}/${idx}`,
                  tab,
                )}
                href="#"
              >
                <img
                  key={idx}
                  src={`${prefixUrl}/${collectionName}/${idx}`}
                  alt=""
                />
              </a>
            ))}
        </div>
      </div>

      <div
        className="pattern-content"
        style={{ display: tab === 'custom' ? 'block' : 'none' }}
      >
        <div className="line" style={{ marginTop: 10 }}>
          {userImages &&
            (Object.values(userImages) || []).map((idx) => (
              <a
                key={`${idx}`}
                onClick={handleClick(
                  `${process.env.REACT_APP_S3_HOST}/${idx}`,
                  tab,
                )}
                href="#"
              >
                <img
                  key={idx}
                  src={`${process.env.REACT_APP_S3_HOST}/${idx}`}
                  alt=""
                />
              </a>
            ))}
        </div>

        <div className="drop">
          <input
            type="file"
            accept="image/*"
            multiple
            // onChange={handleSelectFile(i)}
            onChange={handleMultiSelectFile}
          />
          <i className="hb-ico drop-plus-ico" />
          <div>Select a file to upload</div>
        </div>
      </div>
    </div>
  )
}

export default ShapesMenu
