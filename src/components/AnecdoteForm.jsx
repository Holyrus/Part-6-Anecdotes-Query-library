import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'

const AnecdoteForm = () => {

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
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
