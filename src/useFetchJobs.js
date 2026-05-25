import { useReducer, useEffect } from 'react'
import axios from 'axios'

const ACTIONS = {
  MAKE_REQUEST: 'make-request',
  GET_DATA: 'get-data',
  ERROR: 'error',
  UPDATE_HAS_NEXT_PAGE: 'update-has-next-page'
}

const getBaseUrl = (country) => `https://api.adzuna.com/v1/api/jobs/${(country || 'in').toLowerCase()}/search`;

const APP_ID = '44418c10';
const APP_KEY = 'b33530b2c2ea7473ae35998606f660de';

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { 
        ...state, 
        loading: true, 
        jobs: action.payload.page === 1 ? [] : state.jobs 
      }
    case ACTIONS.GET_DATA:
      return { 
        ...state, 
        loading: false, 
        jobs: action.payload.page === 1 
          ? action.payload.jobs 
          : [...state.jobs, ...action.payload.jobs] 
      }
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
    dispatch({ type: ACTIONS.MAKE_REQUEST, payload: { page } })

    const country = params.country || 'in';
    const baseUrl = getBaseUrl(country);

    const queryParams1 = {
      app_id: APP_ID,
      app_key: APP_KEY,
      what: params.description,
      where: params.location,
      'content-type': 'application/json'
    };

    if (params.full_time) queryParams1.full_time = 1;
    if (params.salary_min) queryParams1.salary_min = params.salary_min;
    if (params.sort_by) queryParams1.sort_by = params.sort_by;

    axios.get(`${baseUrl}/${page}`, {
      cancelToken: cancelToken1.token,
      params: queryParams1
    }).then(res => {
      // Map Adzuna response format
      const formattedJobs = res.data.results.map(job => ({
        id: job.id,
        type: job.contract_time === 'full_time' ? 'Full Time' : (job.contract_time === 'part_time' ? 'Part Time' : 'Contract/Other'),
        url: job.redirect_url,
        created_at: job.created,
        company: job.company?.display_name || 'N/A',
        company_url: job.company?.url || '',
        location: job.location?.display_name || 'N/A',
        title: job.title,
        description: job.description,
        how_to_apply: `<p><a href="${job.redirect_url}" target="_blank" rel="noopener noreferrer">Apply on Adzuna</a></p>`,
        company_logo: null,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        country: country
      }))
      dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: formattedJobs, page } })
    }).catch(e => {
      if (axios.isCancel(e)) return
      dispatch({ type: ACTIONS.ERROR, payload: { error: e } })
    })

    const cancelToken2 = axios.CancelToken.source()

    const queryParams2 = {
      app_id: APP_ID,
      app_key: APP_KEY,
      what: params.description,
      where: params.location,
      'content-type': 'application/json'
    };

    if (params.full_time) queryParams2.full_time = 1;
    if (params.salary_min) queryParams2.salary_min = params.salary_min;
    if (params.sort_by) queryParams2.sort_by = params.sort_by;

    axios.get(`${baseUrl}/${page + 1}`, {
      cancelToken: cancelToken2.token,
      params: queryParams2
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