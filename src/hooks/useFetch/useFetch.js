import React, { useState, useEffect } from "react"
import axios from "axios"

const useFetch = (url) => {
    const [data, setData] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)


    const getFetch = async () => {
        try {
            const { data: responseData } = await axios.get(url)
            setData(responseData)
            setLoading(false)
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }

    }
    useEffect(() => {
        getFetch()
    }, [])

    return { data, error, loading }
}

export default useFetch