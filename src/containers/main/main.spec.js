import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import Main from './'

// Mock the fetch function to avoid real requests
const fetchMock = () =>
  Promise.resolve({
    json: () => Promise.resolve([
      { name: 'Oxford University' },
      { name: 'Fox Valley Technical College' }
    ]),
  })

describe('Main container', () => {
  let fetchSpy

  beforeAll(() => {
    global.fetch = fetchMock
  })

  it('renders', async () => {
    render(<Main />)

    expect(screen.getByText('University finder')).toBeInTheDocument()
    expect(screen.getByText('Please enter part of the name you are looking for')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.queryByTestId('finder-items')).not.toBeInTheDocument()
  })

  it('searches and display a popup with the results', async () => {
    fetchSpy = jest.spyOn(global, 'fetch')
    render(<Main />)

    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'ox' } })
    await waitFor(() => {
      expect(screen.getByText('Fetching names...')).toBeInTheDocument()
    })
    await waitFor(() => {
      // expect that the endpoint was called with the user input
      expect(fetchSpy).toBeCalledWith('http://universities.hipolabs.com/search?name=ox')
    })
    expect(screen.getByTestId('finder-items')).toBeInTheDocument()
    const matches = screen.getAllByTestId('finder-item')
    expect(matches).toHaveLength(2)
    // expect only results which contains "ox" characters
    expect(matches[0]).toHaveTextContent('Oxford University')
    expect(matches[1]).toHaveTextContent('Fox Valley Technical College')
  })

  it('fills the input text with an item value when it is clicked', async () => {
    global.fetch = fetchMock
    render(<Main />)

    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'ox' } })
    await waitFor(() => {
      expect(screen.getByTestId('finder-items')).toBeInTheDocument()
    })
    const matches = screen.getAllByTestId('finder-item')
    expect(matches).toHaveLength(2)
    fireEvent.click(matches[0])

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('Oxford University')
    })
  })

  it('removes the item list after user empties the input', async () => {
    global.fetch = fetchMock
    render(<Main />)

    // first put some value to display the list
    fireEvent.input(screen.getByRole('textbox'), { target: { value: 'oxf' } })
    await waitFor(() => {
      expect(screen.getByTestId('finder-items')).toBeInTheDocument()
    })

    // now let's empty the input
    fireEvent.input(screen.getByRole('textbox'), { target: { value: '' } })
    await waitFor(() => {
      expect(screen.queryByTestId('finder-items')).not.toBeInTheDocument()
    })
  })
})
