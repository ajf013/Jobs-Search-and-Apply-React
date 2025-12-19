import { useReducer, useEffect } from 'react'
import axios from 'axios'

const ACTIONS = {
  MAKE_REQUEST: 'make-request',
  GET_DATA: 'get-data',
  ERROR: 'error',
  UPDATE_HAS_NEXT_PAGE: 'update-has-next-page'
}

const BASE_URL = 'https://api.adzuna.com/v1/api/jobs/in/search'

const APP_ID = '44418c10';
const APP_KEY = 'b33530b2c2ea7473ae35998606f660de';

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, jobs: [] }
    case ACTIONS.GET_DATA:
      return { ...state, loading: false, jobs: action.payload.jobs }
    case ACTIONS.ERROR:
      return { ...state, loading: false, error: action.payload.error, jobs: [] }
    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload.hasNextPage }
    default:
      return state
  }
}

export default function useFetchJobs(params, page) {
  const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true })

  useEffect(() => {
    const cancelToken1 = axios.CancelToken.source()
    dispatch({ type: ACTIONS.MAKE_REQUEST })

    axios.get(`${BASE_URL}/${page}`, {
      cancelToken: cancelToken1.token,
      params: {
        app_id: APP_ID,
        app_key: APP_KEY,
        what: params.description,
        where: params.location,
        'content-type': 'application/json'
      }
    }).then(res => {
      // Map Adzuna response format
      const formattedJobs = res.data.results.map(job => ({
        id: job.id,
        type: job.contract_time || 'Full Time', // Adzuna might not always have this
        url: job.redirect_url,
        created_at: job.created,
        company: job.company.display_name,
        company_url: job.company.url, // sometimes available
        location: job.location.display_name,
        title: job.title,
        description: job.description, // Adzuna gives summary, or html in some plans. It's often plain text with highlights.
        how_to_apply: `<p><a href="${job.redirect_url}" target="_blank" rel="noopener noreferrer">Apply on Adzuna</a></p>`,
        company_logo: null
      }))
      dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: formattedJobs } })
    }).catch(e => {
      if (axios.isCancel(e)) return
      dispatch({ type: ACTIONS.ERROR, payload: { error: e } })
    })

    const cancelToken2 = axios.CancelToken.source()

    axios.get(`${BASE_URL}/${page + 1}`, {
      cancelToken: cancelToken2.token,
      params: {
        app_id: APP_ID,
        app_key: APP_KEY,
        what: params.description,
        where: params.location,
        'content-type': 'application/json'
      }
    }).then(res => {
      dispatch({ type: ACTIONS.UPDATE_HAS_NEXT_PAGE, payload: { hasNextPage: res.data.results.length !== 0 } })
    }).catch(e => {
      if (axios.isCancel(e)) return
      dispatch({ type: ACTIONS.ERROR, payload: { error: e } })
    })

    return () => {
      cancelToken1.cancel()
      cancelToken2.cancel()
    }
  }, [params, page])

  return state
}