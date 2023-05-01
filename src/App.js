import { useState } from "react"
import Modal from "./components/Modal";

const App = () => {
  const [images, setImages] = useState(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const surpriseOption = [
    'A blue ostrich eating melon',
    'A matisse style shark on the telephone',
    'A pineaple sunbathing on an island'
  ]
  const surpriseMe = () => {
    setImages(null)
    if (value === null) {
      setError('Error! Must have a search term')
    }
    const randomValue = surpriseOption[Math.floor(Math.random() * surpriseOption.length)]
    setValue(randomValue)
  }
  const getImages = async () => {
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          message: value
        }),
        headers: {
          "Content-type": "application/json"
        }

      }
      const response = await fetch('http://localhost:8000/images', options)
      const data = await response.json()
      setImages(data)
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }
  const uploadImage = async (e) => {
    setModalOpen(true)

    console.log(e.target.files[0])
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setSelectedImage(e.target.files[0])
    // e.target.value = null
    try {
      const options = {
        method: "POST",
        body: formData
      }
      const response = await fetch('http://localhost:8000/upload', options)
      const data = await response.json()
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  const generateVariations = async () => {
    setImages(null)
    if (selectedImage === null) {
      setError('Error! Must have an existing image')
      setModalOpen(false)
      return
    }
    try {
      const options = {
        method: 'POST'
      }

      const response = await fetch('http://localhost:8000/variations', options)
      console.log(response)
      const data = await response.json()
      console.log(data)
      setImages(data)
      setError(null)
      setModalOpen(false)
    } catch (error) {
      console.error(error)
    }

  }

  return (
    <div className="app">
      <section className="search-section">
        <p>Start with a detailed description
          <span
            onClick={surpriseMe}
            className="surprise">Surprise me</span>
        </p>
        <div className="input-container">
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="An impressionist oil painting of a sunfower in a purple vas..." />
          <button onClick={getImages}>Generate </button>
        </div>
        <p className="extra-inffo">Or,
          <span>
            <label htmlFor="files"> upload an image </label>
            <input onChange={uploadImage} id="files" type="file" accept="image" hidden />
          </span>
          to edit.
        </p>
        {error && <p>{error}</p>}
        {modalOpen &&
          <div className="overlay">
            <Modal
              setModalOpen={setModalOpen}
              setSelectedImage={setSelectedImage}
              selectedImage={selectedImage}
              generateVariations={generateVariations} />
          </div>}
      </section>
      <section className="image-section">
        {images?.map((image, _index) => (
          <img key={_index} src={image.url} alt={`Generetid poto of ${value}`} />
        ))}
      </section>
    </div>
  );
}

export default App;
