import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'

import { useNotificationDispatch } from './components/NotificationContext'

const App = () => {

  const dispatch = useNotificationDispatch()

  const handleVoteButtonClick = (anecdote) => {
    handleVote(anecdote)
    dispatch({ type: "VOTE", payload: `You voted for ${anecdote.content}`})
    setTimeout(() => {
      dispatch({ type: "CLEAR"})
    }, 5000)
  }

  // -----------------------------------------------------------

  const queryClient = useQueryClient()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    // }

    onSuccess: (updatedAnecdote) => {
      queryClient.setQueryData(['anecdotes'], (oldData) => {
        console.log(oldData)
        return oldData.map(anecdote => anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote)
      })
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false, //Preventing to reupdate the render every window focus. It causes more unnecesary rerenders.
    // retry: false, //Preventing to retrying fetching the DB if it didn't loaded it for the first time.
    // retry: 1, // You can specifiy the number of retries fetching the DB. Default: 3 times.
  })

  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading) {
    return <div>Loading data...</div>
  } else if (result.status === 'error') {
    return <div>Anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  // ---------------------------------------------------------

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            {/* <button onClick={() => handleVote(anecdote)}>vote</button> */}
            <button onClick={() => handleVoteButtonClick(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
