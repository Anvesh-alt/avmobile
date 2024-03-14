import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

const Home = props => {
  const jwtToken = Cookies.get('jwt_token')
  const [jokes, setJokes] = useState([])
  const [loading, setLoading] = useState(true)

  const onClickLogout = () => {
    const {history} = props

    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        const response = await fetch(
          'https://v2.jokeapi.dev/joke/any?format=json&blacklistFlags=nsfw,sexist&type=single&lang=EN&amount=10',
        )
        const data = await response.json()
        if (response.ok) {
          setJokes(data.jokes)
        } else {
          throw new Error(data.error || 'Failed to fetch jokes')
        }
      } catch (error) {
        console.error('Error fetching jokes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJokes()
  }, [])

  if (!jwtToken) {
    return <Redirect to="/login" />
  }

  return (
    <div className="home-container">
      <h1 className="head">Welcome to the Home Page!</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="jokes-container">
          <table className="jokes-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Joke</th>
              </tr>
            </thead>
            <tbody>
              {jokes.map(joke => (
                <tr key={joke.joke}>
                  {' '}
                  {/* Using joke text as the key */}
                  <td>{joke.category}</td>
                  <td>{joke.joke}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button type="button" className="nav-mobile-btn" onClick={onClickLogout}>
        {' '}
        LogOut
      </button>
    </div>
  )
}

export default Home
