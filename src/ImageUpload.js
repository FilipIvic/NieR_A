import React, {useState} from 'react'
import './ImageUpload.css'

import firebase from 'firebase'
import {db, storage} from './firebase'

import {Button} from '@material-ui/core'


function ImageUpload({username, handleShowChange}) {

    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [upload, setUpload] = useState(false)
    const [visible, setVisible] = useState(false)

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
            setUpload(true)
        }
    }

    const handleUpload = () => {
        setVisible(true)
        const uploadTask = storage.ref(`images/${image.name}`).put(image)
        uploadTask.on(
            //progress function
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },

            (error) => {
                //error message
                console.log(error)
                alert(error.message)
            },

            () => {
                //complete function
                storage.ref("images").child(image.name).getDownloadURL().then((url) => {
                    //post image inside url
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username
                    })

                    setProgress(0)
                    setCaption('')
                    setImage(null)

                    handleShowChange()
                })
            }
        )
    }

    return (
        <div className="imageUpload">
            <h4>UPLOAD NEW POST</h4>
            <input className="imageUpload__caption" type="text" placeholder='Enter a caption...' onChange={event => setCaption(event.target.value)} value={caption}/>
            <input className="imageUpload__file" type="file" onChange={handleChange}/>
            {upload ? <Button className="imageUpload__button" onClick={handleUpload}> Upload </Button> : null }
            {visible ? <progress className="imageUpload__progress" value={progress} max="100"/> : null }
        </div>
    )
}

export default ImageUpload
