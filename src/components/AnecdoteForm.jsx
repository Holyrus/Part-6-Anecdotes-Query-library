import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from './NotificationContext'

const AnecdoteForm = () => {

  const dispatch = useNotificationDispatch()

  // ----------------------------------

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    // It rerender the all anecodotes list after 
    // success adding new anecdote to the DB and display the new anecdote
    // It makes additional GET request so its not good for performance
    
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    // }

    // Instead use:

    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    },
    onError: () => {
      dispatch({ type: "POST_FAIL", payload: `Too short anecdote, must have length 5 or more`})
      setTimeout(() => {
        dispatch({ type: "CLEAR" })
      }, 5000);
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    if (content !== '' && content.length > 4) {
    dispatch({ type: "CREATE", payload: `You created anecdote - ${content}` })
    setTimeout(() => {
      dispatch({ type: "CLEAR"})
    }, 5000)
  }
}

  return (
    <div>
      <h3>Create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
